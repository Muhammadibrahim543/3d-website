import os
import re

project_dir = r"c:\Users\KIRA63\Desktop\gemini test\3d-printing-benchmark\gemini-3-5"
exts_to_check = ['.html', '.js', '.css']

updated_files = []

for root, dirs, files in os.walk(project_dir):
    for f in files:
        if any(f.endswith(ext) for ext in exts_to_check):
            file_path = os.path.join(root, f)
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Match images/filename.jpeg, .jpg, .png
            new_content = re.sub(r'images/([A-Za-z0-9_\-\(\)\s]+)\.(jpeg|jpg|png)', r'images/\1.webp', content, flags=re.IGNORECASE)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                updated_files.append(f)
                print(f"Updated image extensions in {f}")

print(f"\nSuccessfully updated {len(updated_files)} files: {', '.join(updated_files)}")
