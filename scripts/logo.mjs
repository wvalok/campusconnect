import sharp from "sharp";
import { mkdirSync } from "node:fs";

const src = "C:/Users/ALOK/Downloads/images-removebg-preview.png";
mkdirSync("public", { recursive: true });

// Full lockup, trimmed of transparent margin, for the login screen.
await sharp(src)
  .trim({ threshold: 10 })
  .resize({ width: 640, withoutEnlargement: true })
  .png()
  .toFile("public/bennett-logo.png");

// Shield only: crop the upper portion (separate pass), then trim + resize.
const cropped = await sharp(src)
  .extract({ left: 100, top: 2, width: 248, height: 262 })
  .png()
  .toBuffer();
await sharp(cropped)
  .trim({ threshold: 10 })
  .resize({ width: 256, height: 256, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("public/bennett-mark.png");

// Favicon / app icon: shield on a white rounded tile so it reads on any tab colour.
const shield = await sharp("public/bennett-mark.png")
  .resize({ width: 46, height: 46, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
await sharp({
  create: { width: 64, height: 64, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: shield, gravity: "center" }])
  .png()
  .toFile("app/icon.png");

console.log("done");
for (const f of ["public/bennett-logo.png", "public/bennett-mark.png", "app/icon.png"]) {
  const m = await sharp(f).metadata();
  console.log(`  ${f}: ${m.width}x${m.height}`);
}
