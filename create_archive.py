import os
import shutil
import zipfile
from datetime import datetime

def create_archive():
    archive_name = f"KOT-project-{datetime.now().strftime('%Y-%m-%d')}.zip"
    temp_dir = "KOT-archive-temp"

    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    os.makedirs(temp_dir, exist_ok=True)

    print("Копирование файлов...")

    if os.path.exists("src"):
        shutil.copytree("src", os.path.join(temp_dir, "src"))
    if os.path.exists("mobile-app"):
        shutil.copytree("mobile-app", os.path.join(temp_dir, "mobile-app"))
    if os.path.exists("public"):
        shutil.copytree("public", os.path.join(temp_dir, "public"))

    files_to_copy = [
        "package.json",
        "package-lock.json",
        "vite.config.js",
        "index.html",
        ".gitignore"
    ]

    for file in files_to_copy:
        if os.path.exists(file):
            shutil.copy2(file, temp_dir)

    for file in os.listdir("."):
        if file.endswith((".md", ".txt")) and os.path.isfile(file):
            shutil.copy2(file, temp_dir)

    for file in os.listdir("."):
        if file.endswith((".bat", ".ps1")) and os.path.isfile(file):
            shutil.copy2(file, temp_dir)

    for file in os.listdir("."):
        if file.endswith(".js") and os.path.isfile(file) and "node_modules" not in file:
            shutil.copy2(file, temp_dir)

    print(f"Создание архива {archive_name}...")
    with zipfile.ZipFile(archive_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_dir)
                zipf.write(file_path, arcname)

    shutil.rmtree(temp_dir)

    size_mb = os.path.getsize(archive_name) / (1024 * 1024)

    print(f"\n✓ Готово! Архив создан: {archive_name}")
    print(f"  Размер архива: {size_mb:.2f} MB")
    print(f"\nОтправьте этот архив получателю.")
    print(f"\nПолучателю нужно будет:")
    print(f"1. Распаковать архив")
    print(f"2. Открыть папку в терминале")
    print(f"3. Выполнить: npm install")
    print(f"4. Запустить: npm run dev")

if __name__ == "__main__":
    try:
        create_archive()
    except Exception as e:
        print(f"Ошибка: {e}")
        input("Нажмите Enter для выхода...")
