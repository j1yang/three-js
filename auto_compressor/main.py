import subprocess
from pathlib import Path
import glob
from venv import create


def createOutputFile(inputFile):
    symbol = ''

    if ktx2Type == '1':
        symbol = "_etc1s"
    else:
        symbol = "_uastc"

    file = Path(inputFile).stem + "_ktx2" + symbol + ".glb"
    return inputPath + "_ktx2" + symbol + "\\" + file


def compressETC1S(inputFiles, outputFiles):
    # ask param
    # gltf-transform etc1s input.glb output.glb --verbose
    for i in range(len(inputFiles)):
        command = ["gltf-transform", "etc1s",
                   inputFiles[i], outputFiles[i], "--verbose"]
        # display command
        print(command)
        # run command
        subprocess.run(command, shell=True)


def compressUASTC(inputFiles, outputFiles):
    # gltf-transform uastc input.glb output.glb --level 4 --rdo 4 --zstd 18 --verbose
    # ask param: zstd leve;
    zstdLevel = 18

    while True:
        try:
            zstdLevel = int(input("UASTC zstd Lever [1, 22]: "))

        except not 0 <= zstdLevel <= 22:
            print("Please enter a valid integer")
            continue
        else:
            break

    print(zstdLevel)

    for i in range(len(inputFiles)):
        command = ["gltf-transform", "uastc",
                   inputFiles[i], outputFiles[i], "--level", "4", "--rdo", "4", "--zstd", str(zstdLevel), "--verbose"]
        # display command
        print(command)
        # run command
        subprocess.run(command, shell=True)


command = []
# Get folder path that contains glb ./glbfiles
print("Folder Name:")
inputPath = input()

# get all file paths
inputFiles = glob.glob(inputPath + "\*.glb")

# Get ktx2 type
print("1. etc1s")
print("2. uastc")
print("Select KTX2 Compression Type:")
ktx2Type = input()

# Create output files names
outputFiles = list(map(createOutputFile, inputFiles))

# Get compression parameter settings
if ktx2Type == '1':
    # Create output folder if doesn't exist
    Path(".\\" + inputPath + "_ktx2_etc1s").mkdir(parents=True, exist_ok=True)
    compressETC1S(inputFiles, outputFiles)
elif ktx2Type == '2':
    # Create output folder if doesn't exist
    Path(".\\" + inputPath + "_ktx2_uastc").mkdir(parents=True, exist_ok=True)
    compressUASTC(inputFiles, outputFiles)
