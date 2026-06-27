"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePointer } from "@/lib/usePointer";
import { compass } from "@/lib/compass";
import styles from "./CompassStage.module.css";

const COL = {
  orange: 0xff7f32,
  blue: 0x298fc2,
  green: 0x6cc24a,
  white: 0xdfe5ea,
  dial: 0x9fb0bf,
};

/**
 * The single persistent particle compass. Fixed, full-screen, behind the page.
 * It lerps toward `compass.target` (set by the splash / hero / dark sections) so
 * one WebGL context travels the page. Dark sections are transparent to reveal it;
 * light sections sit opaque on top. Owns the pointer, pauses when fully faded.
 */
export default function CompassStage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointer = usePointer();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 760;
    const Q = isSmall ? 0.45 : 1;
    const n = (base: number) => Math.max(1, Math.round(base * Q));

    const dotTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.7)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };
    const tex = dotTexture();

    type Pts = THREE.Points & { userData: { orig: Float32Array; phase: Float32Array } };

    const makePoints = (
      positions: number[],
      colors: number[],
      size: number,
      opacity: number,
      blending: THREE.Blending = THREE.NormalBlending,
    ): Pts => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size,
        map: tex,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat) as unknown as Pts;
      pts.userData.orig = new Float32Array(positions);
      const count = positions.length / 3;
      const phase = new Float32Array(count);
      for (let i = 0; i < count; i++) phase[i] = Math.random() * Math.PI * 2;
      pts.userData.phase = phase;
      return pts;
    };

    const buildParticles = () => {
      const C = {
        orange: new THREE.Color(COL.orange),
        blue: new THREE.Color(COL.blue),
        green: new THREE.Color(COL.green),
        white: new THREE.Color(COL.white),
        dial: new THREE.Color(COL.dial),
      };
      const push = (p: number[], c: number[], x: number, y: number, z: number, col: THREE.Color, dim = 1) => {
        p.push(x, y, z);
        c.push(col.r * dim, col.g * dim, col.b * dim);
      };

      const dp: number[] = [];
      const dc: number[] = [];
      for (let i = 0; i < n(5200); i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2.5 + Math.random() * 0.14;
        push(dp, dc, Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.05, C.dial, 0.5 + Math.random() * 0.5);
      }
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const card = i % 18 === 0;
        const count = n(card ? 90 : 28);
        const r1 = card ? 2.18 : 2.34;
        for (let j = 0; j < count; j++) {
          const r = r1 + Math.random() * (2.46 - r1);
          const jit = (Math.random() - 0.5) * 0.015;
          push(
            dp,
            dc,
            Math.cos(a) * r + Math.cos(a + Math.PI / 2) * jit,
            Math.sin(a) * r + Math.sin(a + Math.PI / 2) * jit,
            (Math.random() - 0.5) * 0.04,
            card ? C.white : C.dial,
            card ? 1 : 0.45 + Math.random() * 0.4,
          );
        }
      }
      const dial = makePoints(dp, dc, 0.045, 0.8, THREE.AdditiveBlending);

      const bp: number[] = [];
      const bc: number[] = [];
      const blade = (col: THREE.Color, len: number, half: number, rot: number, count: number) => {
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        for (let i = 0; i < count; i++) {
          const y = Math.pow(Math.random(), 0.75) * len;
          const w = y > 0.26 ? half * (1 - (y - 0.26) / (len - 0.26)) : half * (y / 0.26);
          const x = (Math.random() * 2 - 1) * w;
          const rx = x * cos - y * sin;
          const ry = x * sin + y * cos;
          push(bp, bc, rx, ry, (Math.random() - 0.5) * 0.1, col, 0.55 + Math.random() * 0.55);
        }
      };
      blade(C.orange, 2.05, 0.21, 0, n(5200));
      blade(C.green, 2.05, 0.21, Math.PI, n(5200));
      blade(C.blue, 2.5, 0.23, -Math.PI / 2, n(6200));
      blade(C.white, 2.5, 0.23, Math.PI / 2, n(6200));
      for (let i = 0; i < n(700); i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.05 + Math.random() * 0.13;
        push(bp, bc, Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.08, C.white, 0.8);
      }
      const blades = makePoints(bp, bc, 0.052, 0.92);

      const sp: number[] = [];
      const sc: number[] = [];
      const dustCols = [C.dial, C.blue, C.orange, C.white];
      for (let i = 0; i < n(1100); i++) {
        push(sp, sc, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5, dustCols[(Math.random() * 4) | 0], 0.12 + Math.random() * 0.3);
      }
      const dust = makePoints(sp, sc, 0.06, 0.5, THREE.AdditiveBlending);

      return { dial, blades, dust };
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;z-index:0;";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const built = buildParticles();
    const group = new THREE.Group();
    group.add(built.dial);
    group.add(built.blades);
    scene.add(built.dust);
    scene.add(group);
    group.rotation.x = -0.16;

    let visH = 1;
    let visW = 1;
    let gsBase = 1;
    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      visW = visH * camera.aspect;
      gsBase = Math.min(visH * 0.92, visW * 0.52) / 5.1;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // start centred so it doesn't jump on first frame
    group.position.set(0, 0, 0);
    group.scale.setScalar(gsBase);
    let curOpacity = 0;

    const animatePoints = (pts: Pts, t: number, amp: number, mwx: number, mwy: number, repel: boolean) => {
      const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const orig = pts.userData.orig;
      const ph = pts.userData.phase;
      const count = arr.length / 3;
      const r2 = 1.1;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const p = ph[i];
        let tx = orig[i3] + Math.sin(t * 0.7 + p) * amp;
        let ty = orig[i3 + 1] + Math.cos(t * 0.6 + p * 1.3) * amp;
        const tz = orig[i3 + 2] + Math.sin(t * 0.5 + p * 0.7) * amp * 1.6;
        if (repel) {
          const dx = tx - mwx;
          const dy = ty - mwy;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / 1.05) * 0.55;
            tx += (dx / d) * f;
            ty += (dy / d) * f;
          }
        }
        arr[i3] += (tx - arr[i3]) * 0.07;
        arr[i3 + 1] += (ty - arr[i3 + 1]) * 0.07;
        arr[i3 + 2] += (tz - arr[i3 + 2]) * 0.07;
      }
      pos.needsUpdate = true;
    };

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);

      // ease the canvas opacity toward the target; skip work while invisible
      curOpacity += (compass.target.opacity - curOpacity) * 0.08;
      renderer.domElement.style.opacity = curOpacity.toFixed(3);
      if (curOpacity < 0.015 && compass.target.opacity === 0) return;

      const p = pointer.current;
      const t = (performance.now() - t0) / 1000;

      // ease toward the shared target position + scale (tighter tracking so the
      // compass clearly travels with the scroll rather than feeling pinned)
      const dxWorld = (compass.target.xFrac - 0.5) * visW;
      const dyWorld = (0.5 - compass.target.yFrac) * visH;
      group.position.x += (dxWorld - group.position.x) * 0.13;
      group.position.y += (dyWorld - group.position.y) * 0.13;
      const desiredScale = gsBase * compass.target.scale;
      const cs = group.scale.x + (desiredScale - group.scale.x) * 0.13;
      group.scale.setScalar(cs);

      group.rotation.y += (p.mx * 0.22 - group.rotation.y) * 0.05;
      group.rotation.x += (-0.16 + p.my * 0.14 - group.rotation.x) * 0.05;
      built.blades.rotation.z = Math.sin(t * 0.24) * 0.14 - p.mx * 0.42;
      built.dial.rotation.z = t * 0.018;
      built.dust.rotation.z = t * 0.006;

      const mwx0 = (p.mx * visW) / 2 - group.position.x;
      const mwy0 = (-p.my * visH) / 2 - group.position.y;
      const cb = Math.cos(built.blades.rotation.z);
      const sb = Math.sin(built.blades.rotation.z);
      const lx = (mwx0 * cb + mwy0 * sb) / cs;
      const ly = (-mwx0 * sb + mwy0 * cb) / cs;
      const cd = Math.cos(built.dial.rotation.z);
      const sd = Math.sin(built.dial.rotation.z);
      const dxl = (mwx0 * cd + mwy0 * sd) / cs;
      const dyl = (-mwx0 * sd + mwy0 * cd) / cs;

      if (!reduceMotion) {
        animatePoints(built.blades, t, 0.018, lx, ly, true);
        animatePoints(built.dial, t, 0.014, dxl, dyl, true);
      }

      if (compass.headingEl) {
        const deg = (((-built.blades.rotation.z * 180) / Math.PI) % 360 + 360) % 360;
        compass.headingEl.textContent = deg.toFixed(1).padStart(5, "0");
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      tex.dispose();
      [built.dial, built.blades, built.dust].forEach((pts) => {
        pts.geometry.dispose();
        (pts.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [pointer]);

  return (
    <div ref={mountRef} className={styles.stage} aria-hidden="true">
      {/* ambient glows (continuous). Readability scrim lives per-section so it can
          match each section's content side without dimming a left-placed compass. */}
      <div className={styles.glowBlue} />
      <div className={styles.glowOrange} />
    </div>
  );
}
