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

## Where the current photos are used (17 Nov 2026)

| Files | Used for | How it was matched |
|---|---|---|
| `rooms/luxury-1..3` | Luxury Room | Four-poster king bed, couch, loft ladder (child beds), claw-foot bath – matches LekkeSlaap's "king bed, bath and shower, couch" |
| `rooms/standard-double-1..3` | Standard Double Room | Double bed with seating area (couch) – **please confirm** |
| `rooms/basic-double-1..2` | Basic Double Room | Shower and basin open-plan in the room – matches "open-plan, limited privacy" |
| `rooms/twin-1` | Standard Twin Room | Two single beds |
| `rooms/classic-triple-1..3` | Classic Triple Room | Double bed + single bed in one room |
| `rooms/room-*` | "No two rooms are the same" gallery | Other rooms and bathrooms that couldn't be tied to one room type for certain |
| `food/*` | Bakery & Restaurant gallery, Weddings & Events | Platters, salads, table setting |
| `grounds/*` | Home "Around the hotel", History & Location "The grounds", Bakery page, Weddings chapters | Gardens, courtyard, chapel pews, dining room, bakery, details |
| `rooms/luxury-romantic*` | Luxury Room gallery and Weddings "The stay" | Luxury Room dressed for a special occasion |

Every photo has a full size (`name.webp`, about 1200 px) and a small size (`name-sm.webp`). To move a photo to another room, change the file names in `src/pages/rooms.html`.
