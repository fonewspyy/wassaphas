"use client";

import { useEffect, useRef } from "react";
import { MOTION_OK, gsap } from "./gsap";

/**
 * Hero backdrop: a warehouse floor seen from above. Parcels stand in bays between marked
 * aisles, small AGV carts run the aisles, and a scanner beam sweeps the floor. Every parcel
 * the beam crosses lifts and glows teal for a moment, the way a checked box lights up on his
 * scan screens, and the beam carries its own teal light across the floor. The sun drifts so
 * the shadows move, the far end fades into the bench colour, parcels near the pointer rise,
 * and the camera climbs as the hero scrolls away.
 *
 * Three.js is loaded only here, after hydration. GSAP drives the beam, the carts, the sun,
 * the pointer easing, the scroll tilt and the render loop (gsap.ticker). Rendering stops
 * while the hero is off screen. Reduced motion gets one still frame; no WebGL, nothing.
 */
export function ParcelField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let teardown = () => {};

    void (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return; // no WebGL: the hero simply has no backdrop
      }
      const still = !window.matchMedia(MOTION_OK).matches;
      const small = el.clientWidth < 640;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = !small;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xececea, 30, 64); // the far end dissolves into the bench
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
      const disposables: { dispose: () => void }[] = [];
      const keep = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

      // ---- layout: bays between aisles, seeded so it is the same on every visit
      const COLS = small ? 18 : 40;
      const ROWS = small ? 30 : 24;
      const GAP = 1.3;
      let seed = 20251101;
      const rand = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      const colX = (c: number) => (c - (COLS - 1) / 2) * GAP;
      const rowZ = (r: number) => (r - (ROWS - 1) / 2) * GAP;
      const aisleRows = [...Array(ROWS).keys()].filter((r) => r % 6 === 3);
      const aisleCols = [...Array(COLS).keys()].filter((c) => c % 10 === 5);
      const halfW = colX(COLS - 1);
      const halfD = rowZ(ROWS - 1);

      type Parcel = { x: number; z: number; w: number; h: number; d: number; rot: number; scannedAt: number; lift: number };
      const parcels: Parcel[] = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (aisleRows.includes(r) || aisleCols.includes(c) || rand() < 0.22) continue;
          parcels.push({
            x: colX(c) + (rand() - 0.5) * 0.2,
            z: rowZ(r) + (rand() - 0.5) * 0.2,
            w: 0.5 + rand() * 0.35,
            h: 0.15 + rand() * 0.45,
            d: 0.5 + rand() * 0.35,
            rot: (rand() - 0.5) * 0.12,
            scannedAt: -100,
            lift: 0,
          });
        }
      }

      // ---- floor: shadow catcher plus a faint grid
      const shadowFloor = new THREE.Mesh(
        keep(new THREE.PlaneGeometry(200, 200)),
        keep(new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.14 })),
      );
      shadowFloor.rotation.x = -Math.PI / 2;
      shadowFloor.receiveShadow = true;
      scene.add(shadowFloor);
      const grid = new THREE.GridHelper(Math.max(COLS, ROWS) * GAP + 10, Math.max(COLS, ROWS) + 8, 0xcfcfca, 0xdcdcd8);
      grid.position.y = 0.001;
      keep(grid.geometry);
      keep(grid.material as InstanceType<typeof THREE.Material>);
      scene.add(grid);

      // aisle markings: dashed ink lines down the middle of every aisle
      const dashMat = keep(new THREE.LineDashedMaterial({ color: 0x111111, dashSize: 0.45, gapSize: 0.35, transparent: true, opacity: 0.3 }));
      const addLine = (a: [number, number], b: [number, number]) => {
        const g = keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], 0.01, a[1]), new THREE.Vector3(b[0], 0.01, b[1])]));
        const line = new THREE.Line(g, dashMat);
        line.computeLineDistances();
        scene.add(line);
      };
      for (const r of aisleRows) addLine([-halfW - 2, rowZ(r)], [halfW + 2, rowZ(r)]);
      for (const c of aisleCols) addLine([colX(c), -halfD - 2], [colX(c), halfD + 2]);

      // ---- parcels
      const boxGeo = keep(new THREE.BoxGeometry(1, 1, 1));
      boxGeo.translate(0, 0.5, 0); // stand on the floor
      const boxMat = keep(new THREE.MeshLambertMaterial({ color: 0xffffff }));
      const boxes = new THREE.InstancedMesh(boxGeo, boxMat, parcels.length);
      boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      boxes.castShadow = true;
      boxes.receiveShadow = true;
      scene.add(boxes);

      // ---- light: soft sky, a sun that drifts so the shadows move
      scene.add(new THREE.HemisphereLight(0xffffff, 0xc4c4bf, 1.7));
      const sun = new THREE.DirectionalLight(0xffffff, 1.7);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      const reach = Math.max(halfW, halfD) + 4;
      Object.assign(sun.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach, near: 1, far: 90 });
      sun.shadow.bias = -0.0008;
      scene.add(sun, sun.target);
      const sky = { angle: -0.5 };

      // ---- the scanner: a teal line, a faint light curtain, and teal light it carries along
      const beamMat = keep(new THREE.MeshBasicMaterial({ color: 0x3cf0d0, transparent: true, opacity: 0.95, depthWrite: false, fog: false }));
      const beam = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.1, halfD * 2 + 6)), beamMat);
      beam.rotation.x = -Math.PI / 2;
      beam.position.y = 0.02;
      const curtainMat = keep(
        new THREE.MeshBasicMaterial({ color: 0x3cf0d0, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide }),
      );
      const curtain = new THREE.Mesh(keep(new THREE.PlaneGeometry(halfD * 2 + 6, 2.4)), curtainMat);
      curtain.rotation.y = Math.PI / 2;
      curtain.position.y = 1.2;
      const scanner = new THREE.Group();
      scanner.add(beam, curtain);
      for (const z of [-halfD * 0.6, 0, halfD * 0.6]) {
        const glow = new THREE.PointLight(0x3cf0d0, 14, 7, 1.4);
        glow.position.set(0, 1.4, z);
        scanner.add(glow);
      }
      scanner.visible = !still;
      scene.add(scanner);

      // ---- AGV carts running the aisles
      type Cart = { group: InstanceType<typeof THREE.Group>; path: [number, number][]; lengths: number[]; total: number; s: number };
      const cartBody = keep(new THREE.BoxGeometry(0.62, 0.26, 0.46));
      cartBody.translate(0, 0.13, 0);
      const cartLamp = keep(new THREE.BoxGeometry(0.16, 0.05, 0.16));
      cartLamp.translate(0, 0.285, 0);
      const cartMat = keep(new THREE.MeshLambertMaterial({ color: 0x1b1b1b }));
      const lampMat = keep(new THREE.MeshBasicMaterial({ color: 0x3cf0d0 }));
      const carts: Cart[] = [];
      const cartCount = small ? 2 : 5;
      for (let i = 0; i < cartCount && aisleRows.length > 1 && aisleCols.length; i++) {
        const rA = aisleRows[i % aisleRows.length];
        const rB = aisleRows[(i + 1 + Math.floor(rand() * (aisleRows.length - 1))) % aisleRows.length];
        const c = aisleCols[Math.floor(rand() * aisleCols.length)];
        const fromLeft = i % 2 === 0;
        const path: [number, number][] = [
          [fromLeft ? -halfW - 2 : halfW + 2, rowZ(rA)],
          [colX(c), rowZ(rA)],
          [colX(c), rowZ(rB)],
          [fromLeft ? halfW + 2 : -halfW - 2, rowZ(rB)],
        ];
        const lengths = path.slice(1).map((p, k) => Math.hypot(p[0] - path[k][0], p[1] - path[k][1]));
        const group = new THREE.Group();
        const body = new THREE.Mesh(cartBody, cartMat);
        body.castShadow = true;
        group.add(body, new THREE.Mesh(cartLamp, lampMat));
        scene.add(group);
        carts.push({ group, path, lengths, total: lengths.reduce((a, b) => a + b, 0), s: rand() * 10 });
      }
      const placeCart = (cart: Cart) => {
        let s = ((cart.s % cart.total) + cart.total) % cart.total;
        for (let k = 0; k < cart.lengths.length; k++) {
          if (s <= cart.lengths[k] || k === cart.lengths.length - 1) {
            const [ax, az] = cart.path[k];
            const [bx, bz] = cart.path[k + 1];
            const t = Math.min(1, s / cart.lengths[k]);
            cart.group.position.set(ax + (bx - ax) * t, 0, az + (bz - az) * t);
            cart.group.rotation.y = Math.atan2(-(bz - az), bx - ax);
            return;
          }
          s -= cart.lengths[k];
        }
      };

      // ---- per-frame state
      const dummy = new THREE.Object3D();
      const white = new THREE.Color(0xffffff);
      const teal = new THREE.Color(0x3cf0d0);
      const tint = new THREE.Color();
      const view = { tilt: 0 };
      const pointer = { x: 0, z: 0, on: 0 };
      const sweep = { x: -halfW - 3 };
      let lastSweepX = sweep.x;

      const place = (now: number) => {
        for (let i = 0; i < parcels.length; i++) {
          const p = parcels[i];
          if ((lastSweepX - p.x) * (sweep.x - p.x) < 0 && sweep.x > lastSweepX) p.scannedAt = now;
          const since = now - p.scannedAt;
          const glow = since >= 0 && since < 3 ? Math.exp(-since * 1.8) : 0;
          const dx = p.x - pointer.x;
          const dz = p.z - pointer.z;
          const near = Math.max(0, 1 - (dx * dx + dz * dz) / 10) * pointer.on;
          p.lift += (near * 0.7 - p.lift) * 0.12;

          dummy.position.set(p.x, glow * 0.45 + p.lift, p.z);
          dummy.rotation.set(0, p.rot, 0);
          dummy.scale.set(p.w, p.h, p.d);
          dummy.updateMatrix();
          boxes.setMatrixAt(i, dummy.matrix);
          boxes.setColorAt(i, tint.copy(white).lerp(teal, glow * 0.9));
        }
        lastSweepX = sweep.x;
        boxes.instanceMatrix.needsUpdate = true;
        if (boxes.instanceColor) boxes.instanceColor.needsUpdate = true;
        scanner.position.x = sweep.x;
        for (const cart of carts) placeCart(cart);
        sun.position.set(Math.sin(sky.angle) * 24, 30, Math.cos(sky.angle) * 18);
      };

      const frame = () => {
        camera.position.set(0, 26 + view.tilt * 8, 27 - view.tilt * 9);
        camera.lookAt(0, 0, -view.tilt * 3);
        place(gsap.ticker.time);
        renderer.render(scene, camera);
      };

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = w / h >= 1 ? 28 : 46;
        camera.updateProjectionMatrix();
        if (still) frame();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      const dispose = () => {
        for (const d of disposables) d.dispose();
        boxes.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };

      if (still) {
        frame();
        el.style.opacity = "0.9";
        teardown = () => {
          ro.disconnect();
          dispose();
        };
        return;
      }

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(el);

      const ctx = gsap.context(() => {
        // the beam crosses the floor, rests, crosses again
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.6, delay: 1.4 })
          .fromTo(sweep, { x: -halfW - 3 }, { x: halfW + 3, duration: small ? 2.6 : 4.2, ease: "none" });
        // carts drive their routes and back
        for (const cart of carts) {
          gsap.to(cart, { s: `+=${cart.total}`, duration: cart.total / 1.6, ease: "none", repeat: -1, yoyo: true, repeatDelay: 0.8 });
        }
        // the sun drifts, so the shadows slowly turn
        gsap.to(sky, { angle: 0.6, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });

        gsap.to(view, {
          tilt: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.8 },
        });

        gsap.to(el, { opacity: 0.9, duration: 1.4, ease: "power2.out", delay: 0.2 });
      });

      const toX = gsap.quickTo(pointer, "x", { duration: 0.6, ease: "power3" });
      const toZ = gsap.quickTo(pointer, "z", { duration: 0.6, ease: "power3" });
      const toOn = gsap.quickTo(pointer, "on", { duration: 0.5, ease: "power2" });
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        toOn(inside ? 1 : 0);
        if (!inside) return;
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(plane, hit)) {
          toX(hit.x);
          toZ(hit.z);
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const tick = () => {
        if (visible) frame();
      };
      gsap.ticker.add(tick);

      teardown = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        ctx.revert();
        gsap.killTweensOf(pointer);
        io.disconnect();
        ro.disconnect();
        dispose();
      };
    })();

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]"
    />
  );
}
