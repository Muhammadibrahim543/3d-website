import os
from PIL import Image

images_dir = r"c:\Users\KIRA63\Desktop\gemini test\3d-printing-benchmark\gemini-3-5\images"

files = os.listdir(images_dir)
converted_count = 0
total_orig_bytes = 0
total_new_bytes = 0

for filename in files:
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png'] and not filename.endswith('.webp'):
        src_path = os.path.join(images_dir, filename)
        base_name = os.path.splitext(filename)[0]
        dst_path = os.path.join(images_dir, base_name + '.webp')

        orig_size = os.path.getsize(src_path)
        total_orig_bytes += orig_size

        try:
            with Image.open(src_path) as img:
                # Convert RGBA to RGB if needed for saving
                if img.mode in ('RGBA', 'LA') and ext in ['.jpg', '.jpeg']:
                    img = img.convert('RGB')
                elif img.mode == 'P':
                    img = img.convert('RGBA')

                # Resize if larger than 1200px on long edge
                img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                
                img.save(dst_path, 'WEBP', quality=82, method=6)
                new_size = os.path.getsize(dst_path)
                total_new_bytes += new_size
                converted_count += 1
                print(f"Converted {filename}: {orig_size//1024}KB -> {new_size//1024}KB")
        except Exception as e:
            print(f"Error converting {filename}: {e}")

print(f"\nFinished! Converted {converted_count} images.")
print(f"Original total size: {total_orig_bytes / (1024*1024):.2f} MB")
print(f"New WebP total size: {total_new_bytes / (1024*1024):.2f} MB")
print(f"Bandwidth saved: {((total_orig_bytes - total_new_bytes) / total_orig_bytes) * 100:.1f}%")
