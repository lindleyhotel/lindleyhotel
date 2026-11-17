# Adding photos

Photos are plain files in the repository, so they can't get lost in a website builder.

1. **Use the hotel's own photos** (or ones the hotel has permission to use).
2. Export each photo at about **1600 px wide**, JPG or WebP, under ~300 KB.
3. Name them clearly: `room-twin-1.webp`, `room-double-1.webp`, `bakery-counter.webp`, `chapel-1.webp`…
4. Put them in `public/assets/img/`.

## Replacing a room placeholder

In `src/pages/rooms.html`, replace:

```html
<div class="photo-slot" role="img" aria-label="Twin room photo coming soon"><span>Photo coming soon</span></div>
```

with:

```html
<picture>
  <img src="/assets/img/room-twin-1.webp" width="1600" height="1067" alt="Twin room with two single beds and sandstone walls" loading="lazy">
</picture>
```

Write alt text that describes what is in the photo. Then run `node build.js`.

Tip for an AI assistant: give it the photos and say "add these to the rooms page following docs/PHOTOS.md" – it can resize and convert them to WebP.
