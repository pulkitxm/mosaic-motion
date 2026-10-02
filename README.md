# Mosaic Motion

A 30-second, 1920 × 1080 Remotion film with original classical travel artwork. A continuous camera moves across a gold mosaic mural while individual stone tiles reassemble into new scenes.

The film follows the reference's sequence: a portrait assembles from a sketch, an ornate lounge gate opens, a flight seat reclines, suite curtains part, dinner guests lift their glasses, and the mural resolves into a silver travel card. The illustrations, lettering, and ambient soundtrack are original. This is a reconstruction of the movement and visual treatment with a different design.

## Preview and render

Use Node.js 22.18 or later. Dependencies and generated assets are already installed in this project.

```sh
npm start
```

Open `http://localhost:3000`. Select **MosaicJourney** to play the complete film, or **MosaicLab** to isolate a transformation. Use the Props panel to change the settings.

```sh
npm run render
npm run render:preview
npm run still
```

The final video is `renders/mosaic-journey.mp4`. The preview is half resolution. The poster uses the dinner scene at frame 660.

To rebuild from a fresh checkout:

```sh
npm ci
npm run assets
npm start
```

## Engine controls

| Prop | Effect |
| --- | --- |
| `durationSeconds` | Retimes the entire journey, including camera moves and soundtrack. Default: 30. |
| `tileMotion` | Controls how far tesserae travel and rotate at a transformation front. Zero keeps them in place. |
| `revealSoftness` | Controls the thickness of the moving transition front. |
| `seed` | Changes the deterministic order and movement of the revealing tiles. |
| `lighting` | Adjusts the warm moving light across the mural. |
| `grain` | Adjusts the fine film texture. |
| `soundtrack` | Enables the original ambient music in the journey. |

MosaicLab also exposes `scene`, `assetFolder`, `revealMode`, `originX`, and `originY`. With `revealMode` set to `automatic`, a built-in scene uses its authored origin and reveal pattern. Choose `spiral`, `wave`, or `curtain` to override it and use the origin controls. The lab holds the first state for one second, transforms over four seconds, and holds the finished state for three seconds.

## Use your own artwork

Convert any two SVG, PNG, or JPEG images into a new animated mosaic pair:

```sh
npm run pair -- --before=/absolute/path/before.svg --after=/absolute/path/after.svg --name=sample
```

The generator crops both images to the same 1800 × 1080 canvas, builds matching stone geometry, and records which tiles change. The files are saved under `public/pairs/sample`.

In MosaicLab set `assetFolder` to `pairs/sample`, `scene` to `portrait`, and choose a reveal mode. The scene name identifies the pair's file slots; your images can contain any design. A working sample pair is already generated from the portrait artwork.

```sh
npx remotion render src/index.ts MosaicLab renders/custom-pair.mp4 --props=examples/custom-pair.json
```

The reusable rasterizer is in `scripts/mosaic.mjs`, and the image-pair compiler is in `scripts/compile-mosaic.mjs`. The shared tessera geometry, reveal functions, and frame renderer are in `src/engine`.

## Change the mural

Edit the vector artwork in `scripts/artwork.mjs`, then regenerate:

```sh
npm run assets
```

Reload Studio after regenerating images so its loaded artwork cache refreshes.

Tile size and material seed are build options:

```sh
npm run assets -- --tile-size=4.8 --seed=42
```

The default builds 84,375 irregular stone tesserae per panel. Smaller tiles preserve more detail; larger tiles make the stone movement easier to see. Tile size accepts 3 through 24. The material seed determines the shared geometry and color variation. The Studio seed controls the animation separately.

Camera positions and scene timings are in `src/engine/timeline.ts`. All time values use the authored 30-second timeline; the duration prop scales them together. The last scene occupies the dinner panel's position so the dinner transforms directly into the card.

## Validation

```sh
npm run typecheck
npm test
```

The tests cover camera holds during transformations, duration retiming, seeded tile ordering, monotonic reveal progress, and complete tile settlement. Every rendered frame is computed directly from its frame number, so seeking and parallel rendering produce the same result.
