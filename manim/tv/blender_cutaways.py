#!/usr/bin/env python3
"""
OpenIE Research TV — Reproducible Blender 5.3 3D Domain Cutaway Generator.
Renders 10 seamless 90-frame (3.0 s @ 30 fps) transparent RGBA turntable loops
in Blender 5.3 EEVEE using the OpenIE 4-color visual algebra:
  - Obsidian metallic chassis (#141c2e)
  - Amber joules / power rails (#f59e0b)
  - Cyan signal / form / state (#22d3ee)
  - Emerald verified commit gate (#10b981)
  - Rose drift / fault / falsifier (#f43f5e)

Usage:
  blender -b -P manim/tv/blender_cutaways.py -- --out-dir /path/to/cutaways_3d
"""
import argparse
import math
import os
import sys
import bpy


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--frames", type=int, default=90)
    ap.add_argument("--width", type=int, default=640)
    ap.add_argument("--height", type=int, default=540)
    ap.add_argument("--only", default="")
    return ap.parse_args(argv)


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def make_pbr_mat(name, base_rgba, metallic=0.75, roughness=0.28, emit_rgb=None, emit_strength=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = base_rgba
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if "Alpha" in bsdf.inputs:
        bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1.0 and hasattr(mat, "surface_render_method"):
        mat.surface_render_method = "BLENDED"
    if emit_rgb and emit_strength > 0.0:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emit_rgb, 1.0)
            bsdf.inputs["Emission Strength"].default_value = emit_strength
    return mat


def build_palette():
    return {
        "obsidian": make_pbr_mat("Obsidian", (0.06, 0.09, 0.16, 1.0), metallic=0.88, roughness=0.24),
        "slate": make_pbr_mat("Slate", (0.14, 0.20, 0.32, 1.0), metallic=0.72, roughness=0.32),
        "glass": make_pbr_mat("Glass", (0.12, 0.28, 0.42, 0.32), metallic=0.15, roughness=0.10, alpha=0.32),
        "amber": make_pbr_mat("Amber", (0.96, 0.62, 0.04, 1.0), metallic=0.5, roughness=0.22, emit_rgb=(0.96, 0.62, 0.04), emit_strength=2.8),
        "cyan": make_pbr_mat("Cyan", (0.13, 0.83, 0.93, 1.0), metallic=0.4, roughness=0.20, emit_rgb=(0.13, 0.83, 0.93), emit_strength=2.8),
        "emerald": make_pbr_mat("Emerald", (0.06, 0.73, 0.51, 1.0), metallic=0.4, roughness=0.22, emit_rgb=(0.06, 0.73, 0.51), emit_strength=2.8),
        "rose": make_pbr_mat("Rose", (0.96, 0.25, 0.37, 1.0), metallic=0.4, roughness=0.25, emit_rgb=(0.96, 0.25, 0.37), emit_strength=2.6),
    }


def setup_studio(width, height, frames):
    scn = bpy.context.scene
    scn.render.engine = "BLENDER_EEVEE"
    scn.render.resolution_x = width
    scn.render.resolution_y = height
    scn.render.resolution_percentage = 100
    scn.render.film_transparent = True
    scn.render.image_settings.file_format = "PNG"
    scn.render.image_settings.color_mode = "RGBA"
    scn.frame_start = 0
    scn.frame_end = frames - 1
    if hasattr(scn, "eevee") and hasattr(scn.eevee, "taa_render_samples"):
        scn.eevee.taa_render_samples = 16

    world = bpy.data.worlds.new("StudioWorld")
    scn.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0.04, 0.06, 0.12, 1.0)
        bg.inputs[1].default_value = 0.7

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    rig = bpy.context.active_object
    rig.name = "TurntableRig"

    bpy.ops.object.camera_add(location=(0.0, -5.6, 2.55), rotation=(math.radians(66.5), 0.0, 0.0))
    cam = bpy.context.active_object
    cam.data.lens = 46
    scn.camera = cam

    lights = [
        ("KeyLight", (4.2, -3.8, 4.8), 420.0, (1.0, 0.95, 0.88)),
        ("CyanRim", (-4.5, 3.2, 3.0), 320.0, (0.25, 0.88, 1.0)),
        ("AmberFill", (0.5, 4.6, -1.8), 210.0, (1.0, 0.68, 0.18)),
    ]
    for lname, loc, energy, col in lights:
        bpy.ops.object.light_add(type="AREA", location=loc)
        lt = bpy.context.active_object
        lt.name = lname
        lt.data.energy = energy
        lt.data.size = 3.2
        lt.data.color = col

    rig.rotation_mode = "XYZ"
    rig.rotation_euler = (0.0, 0.0, 0.0)
    rig.keyframe_insert(data_path="rotation_euler", frame=0)
    rig.rotation_euler = (0.0, 0.0, 2.0 * math.pi)
    rig.keyframe_insert(data_path="rotation_euler", frame=frames)
    if rig.animation_data and rig.animation_data.action:
        act = rig.animation_data.action
        fcurves = getattr(act, "fcurves", [])
        for fc in fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"
    return scn, rig


def attach(obj, rig, mat):
    obj.parent = rig
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.append(mat)
    return obj


def add_box(rig, mat, loc, scale, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.scale = scale
    bpy.ops.object.modifier_add(type="BEVEL")
    o.modifiers["Bevel"].width = 0.03
    o.modifiers["Bevel"].segments = 2
    return attach(o, rig, mat)


def add_cyl(rig, mat, loc, r, depth, rot=(0, 0, 0), verts=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    return attach(bpy.context.active_object, rig, mat)


def add_torus(rig, mat, loc, major_r, minor_r, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major_r, minor_radius=minor_r, major_segments=56, minor_segments=18, location=loc, rotation=rot)
    return attach(bpy.context.active_object, rig, mat)


def add_sphere(rig, mat, loc, r, ico=False):
    if ico:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=r, location=loc)
    else:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=16, radius=r, location=loc)
    return attach(bpy.context.active_object, rig, mat)


def scene_01_silicon_kv260_lut6(rig, p):
    add_box(rig, p["obsidian"], (0, 0, -0.22), (3.1, 3.1, 0.20))
    add_box(rig, p["slate"], (0, 0, -0.05), (2.3, 2.3, 0.14))
    for ix in range(-2, 3):
        for iy in range(-2, 3):
            m = p["cyan"] if (ix + iy) % 2 == 0 else p["emerald"]
            add_box(rig, m, (ix * 0.36, iy * 0.36, 0.14), (0.24, 0.24, 0.18))
    add_box(rig, p["amber"], (0, -1.25, 0.08), (1.5, 0.24, 0.16))
    add_torus(rig, p["emerald"], (0, 0, 0.42), 1.38, 0.035)
    for k in range(8):
        ang = k * math.pi / 4.0
        add_box(rig, p["amber"], (math.cos(ang) * 1.42, math.sin(ang) * 1.42, -0.10), (0.16, 0.08, 0.12), (0, 0, ang))


def scene_02_bio_sepj_neural_ratchet(rig, p):
    for i in range(-2, 3):
        x = i * 0.72
        add_sphere(rig, p["glass"], (x, 0, 0.1), 0.36)
        add_sphere(rig, p["cyan"], (x, 0, 0.1), 0.15)
        if i < 2:
            gate_mat = p["rose"] if i == 1 else p["emerald"]
            add_torus(rig, gate_mat, (x + 0.36, 0, 0.1), 0.16, 0.04, (0, math.pi / 2, 0))
    add_box(rig, p["obsidian"], (0, 0, -0.75), (3.2, 1.4, 0.12))
    for k in range(-3, 4):
        add_cyl(rig, p["amber"], (k * 0.42, 0, -0.45), 0.035, 0.55)
    add_torus(rig, p["cyan"], (0, 0, 0.1), 1.65, 0.025, (math.radians(28), 0, 0))


def scene_03_rce_state_polyhedron(rig, p):
    add_sphere(rig, p["cyan"], (0, 0, 0.15), 0.68, ico=True)
    add_sphere(rig, p["glass"], (0, 0, 0.15), 0.92, ico=True)
    add_torus(rig, p["emerald"], (0, 0, 0.15), 1.45, 0.035, (math.radians(22), 0, 0))
    for k in range(6):
        ang = k * math.pi / 3.0
        x, y = math.cos(ang) * 1.55, math.sin(ang) * 1.55
        m = p["rose"] if k == 5 else p["emerald"]
        add_box(rig, p["obsidian"], (x, y, 0.15), (0.42, 0.42, 0.12), (0, 0, ang))
        add_sphere(rig, m, (x, y, 0.28), 0.11)
        add_cyl(rig, p["cyan"] if k < 5 else p["rose"], (x * 0.52, y * 0.52, 0.15), 0.025, 0.9, (math.pi / 2, 0, ang + math.pi / 2))


def scene_04_lockstep_3os_arena(rig, p):
    tilts = [(0.35, 0.0, "cyan"), (-0.35, 0.5, "emerald"), (0.15, -0.45, "amber")]
    for rx, ry, cname in tilts:
        add_torus(rig, p[cname], (0, 0, 0.1), 1.52, 0.035, (rx, ry, 0))
    add_sphere(rig, p["obsidian"], (0, 0, 0.1), 0.42)
    add_sphere(rig, p["amber"], (0, 0, 0.1), 0.22)
    for k in range(8):
        a = k * math.pi / 4.0
        add_sphere(rig, p["emerald"], (math.cos(a) * 1.15, math.sin(a) * 1.15, 0.1 + 0.18 * math.sin(2 * a)), 0.10)
    add_sphere(rig, p["rose"], (1.42, 0.55, 0.62), 0.11)


def scene_05_mei_jcp_sovereign_tag(rig, p):
    add_box(rig, p["obsidian"], (0, 0, -0.05), (2.8, 2.1, 0.14))
    add_box(rig, p["glass"], (0, 0, 0.36), (2.95, 2.25, 0.42))
    add_box(rig, p["slate"], (-0.65, 0.35, 0.12), (0.68, 0.68, 0.16))
    add_box(rig, p["cyan"], (-0.65, -0.48, 0.11), (0.42, 0.32, 0.14))
    add_box(rig, p["emerald"], (0.05, 0.45, 0.11), (0.38, 0.30, 0.14))
    add_cyl(rig, p["amber"], (0.72, -0.10, 0.14), 0.62, 0.18)
    for i in range(-2, 3):
        add_box(rig, p["amber"], (-0.15, i * 0.22, 0.04), (0.85, 0.04, 0.03))


def scene_06_ctc_hellman_torus(rig, p):
    add_torus(rig, p["obsidian"], (0, 0, 0.1), 1.32, 0.42)
    for k in range(12):
        a = k * math.pi / 6.0
        m = p["cyan"] if k % 3 != 0 else p["amber"]
        add_torus(rig, m, (math.cos(a) * 1.32, math.sin(a) * 1.32, 0.1), 0.44, 0.022, (math.pi / 2, 0, a))
    add_torus(rig, p["emerald"], (0, 0, 0.1), 1.82, 0.028)
    add_sphere(rig, p["amber"], (0, 0, 0.1), 0.32)


def scene_07_thermodynamic_tempo_manifold(rig, p):
    for ix in range(-5, 6):
        for iy in range(-5, 6):
            x, y = ix * 0.26, iy * 0.26
            r2 = x * x + y * y
            z = 0.65 * math.exp(-r2 * 0.85) - 0.25 + 0.12 * math.cos(2.2 * x)
            m = p["amber"] if abs(ix) <= 1 else (p["cyan"] if z > 0.05 else p["slate"])
            add_box(rig, m, (x, y, z * 0.5), (0.20, 0.20, max(0.08, z + 0.45)))
    add_torus(rig, p["emerald"], (0, 0, 0.55), 0.55, 0.035)


def scene_08_dnull_drand_crystal(rig, p):
    add_box(rig, p["cyan"], (0, 0, 0.18), (0.85, 0.85, 1.35), (0, 0, math.pi / 4))
    add_box(rig, p["obsidian"], (0, 0, -0.55), (2.4, 2.4, 0.16))
    add_torus(rig, p["amber"], (0, 0, 0.25), 1.55, 0.032, (math.radians(18), 0, 0))
    for k in range(5):
        a = k * 2.0 * math.pi / 5.0
        m = p["emerald"] if k < 2 else p["cyan"]
        add_box(rig, m, (math.cos(a) * 1.55, math.sin(a) * 1.55, 0.25), (0.28, 0.28, 0.28), (0, 0, a))


def scene_09_impedance_parser_funnel(rig, p):
    for k in range(10):
        a = k * math.pi / 5.0
        add_box(rig, p["rose"] if k % 2 == 0 else p["amber"], (math.cos(a) * 1.15, math.sin(a) * 1.15, 0.78), (0.24, 0.24, 0.24), (a, a * 0.5, 0))
    add_torus(rig, p["amber"], (0, 0, 0.52), 1.12, 0.04)
    add_torus(rig, p["cyan"], (0, 0, 0.05), 0.64, 0.04)
    add_cyl(rig, p["glass"], (0, 0, 0.28), 0.88, 0.65)
    for i in range(-1, 2):
        add_box(rig, p["emerald"], (i * 0.34, 0, -0.48), (0.24, 0.24, 0.32))


def scene_10_global_grid_cadence(rig, p):
    add_sphere(rig, p["obsidian"], (0, 0, 0.12), 0.98)
    add_sphere(rig, p["glass"], (0, 0, 0.12), 1.06, ico=True)
    for k in range(3):
        add_torus(rig, p["cyan"] if k != 1 else p["amber"], (0, 0, 0.12), 1.42 + k * 0.18, 0.022, (math.radians(24 * (k + 1)), math.radians(15 * k), 0))
    for k in range(10):
        a = k * math.pi / 5.0
        z = 0.12 + 0.65 * math.sin(a * 1.7)
        r = math.sqrt(max(0.1, 1.02 * 1.02 - (z - 0.12) ** 2))
        add_sphere(rig, p["emerald"] if k % 2 == 0 else p["amber"], (math.cos(a) * r, math.sin(a) * r, z), 0.09)


SCENES = {
    "01_silicon_kv260_lut6": scene_01_silicon_kv260_lut6,
    "02_bio_sepj_neural_ratchet": scene_02_bio_sepj_neural_ratchet,
    "03_rce_state_polyhedron": scene_03_rce_state_polyhedron,
    "04_lockstep_3os_arena": scene_04_lockstep_3os_arena,
    "05_mei_jcp_sovereign_tag": scene_05_mei_jcp_sovereign_tag,
    "06_ctc_hellman_torus": scene_06_ctc_hellman_torus,
    "07_thermodynamic_tempo_manifold": scene_07_thermodynamic_tempo_manifold,
    "08_dnull_drand_crystal": scene_08_dnull_drand_crystal,
    "09_impedance_parser_funnel": scene_09_impedance_parser_funnel,
    "10_global_grid_cadence": scene_10_global_grid_cadence,
}


def main():
    args = parse_args()
    for name, builder in SCENES.items():
        if args.only and args.only != name:
            continue
        clear_scene()
        scn, rig = setup_studio(args.width, args.height, args.frames)
        pal = build_palette()
        builder(rig, pal)
        out_sub = os.path.join(args.out_dir, name)
        os.makedirs(out_sub, exist_ok=True)
        scn.render.filepath = os.path.join(out_sub, "frame_")
        bpy.ops.render.render(animation=True)
        print(f"[blender_cutaways] rendered {name} ({args.frames} frames) -> {out_sub}", flush=True)


if __name__ == "__main__":
    main()
