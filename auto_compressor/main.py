import subprocess
from pathlib import Path
import glob
from venv import create
import os


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
        print('\033[92m' + str(command) + '\033[0m')
        # run command
        subprocess.run(command, shell=True)


def compressUASTC(inputFiles, outputFiles):
    # gltf-transform uastc input.glb output.glb --level 4 --rdo 4 --zstd 18 --verbose
    # ask param: zstd level
    zstdLevel = 18

    while True:
        try:
            print("UASTC zstd Level [1, 22]: ", end=" ")
            zstdLevel = int(input())
            print("\n")
        except ValueError:
            print("\n")
            print('\033[91m' + "ERROR: Please enter a valid integer" + '\033[0m')
            continue
        if 1 <= zstdLevel <= 22:
            break
        else:
            print('\033[91m' + "ERROR: level range [1,22]" + '\033[0m')

    for i in range(len(inputFiles)):
        command = ["gltf-transform", "uastc",
                   inputFiles[i], outputFiles[i], "--level", "4", "--rdo", "4", "--zstd", str(zstdLevel), "--verbose"]
        # display command
        print('\033[92m' + str(command) + '\033[0m')
        # run command
        subprocess.run(command, shell=True)


command = []

'''
Automatic KTX2 Compressor
'''

# __MAIN__

# Get folder path that contains glb ./glbfiles
while True:
    print("Folder Name:", end=" ")
    inputPath = input()
    print("\n")

    if not os.path.exists(".\\" + inputPath):
        print('\033[91m' + "ERROR: Directory doesn't exist." + '\033[0m')
    elif not os.listdir(inputPath):
        print('\033[91m' + "ERROR: glb file doesn't exist." + '\033[0m')
    else:
        break

# get all file paths
inputFiles = glob.glob(inputPath + "\*.glb")

# Get ktx2 type
print("1. etc1s")
print("2. uastc")
print("Select KTX2 Compression Type:", end=" ")
ktx2Type = input()
print("\n")
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
