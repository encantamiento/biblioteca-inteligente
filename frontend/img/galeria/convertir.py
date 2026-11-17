
from PIL import Image
from pathlib import Path
Image.MAX_IMAGE_PIXELS = None

carpeta = Path(__file__).parent
imagenes = [
    f for f in carpeta.iterdir()
    if f.is_file() and f.name.lower().endswith((".jpg", ".jpeg"))
]

convertidas = 0
errores = 0

for archivo in imagenes:
    try:
        with Image.open(archivo) as img:
            img.thumbnail((1920, 1920), Image.Resampling.LANCZOS)

            destino = archivo.with_suffix(".webp")

            img.convert("RGB").save(
                destino,
                "WEBP",
                quality=82,
                method=4
            )

        print("OK:", archivo.name, "->", destino.name)
        convertidas += 1

    except Exception as e:
        print("ERROR:", archivo.name, e)
        errores += 1

print("\nCONVERTIDAS:", convertidas)
print("ERRORES:", errores)
