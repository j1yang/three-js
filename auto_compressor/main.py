import subprocess
from pathlib import Path
import glob
from turtle import width
from venv import create
import os


def printOption(menu, min, max):
    option = 0
    while True:
        try:
            print(menu, end=" ")
            option = int(input())
            print("\n")
        except ValueError:
            print("\n")
            print('\033[91m' + "ERROR: Please enter a valid integer" + '\033[0m')
            continue
        if min <= option <= max:
            break
        else:
            print('\033[91m' + "ERROR: input range [" +
                  str(min) + "," + str(max) + "]" + '\033[0m')

    return option


def createOutputFile(inputFile):
    symbol = ''

    if option == 1:
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


def resizeImages(inputFiles, outputFiles):
    resizeOption = printOption(
        "1. 4K\n2. 2K\n3. 1K\n4. Custom\nSelect resize option: ", 1, 4)

    match resizeOption:
        case 1:
            print('4k')
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_4k").mkdir(parents=True, exist_ok=True)
        case 2:
            print('2k')
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_2K").mkdir(parents=True, exist_ok=True)
        case 3:
            print('1k')
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_1K").mkdir(parents=True, exist_ok=True)
        case 4:
            width = printOption("Enter width: ", 100, 4096)
            height = printOption("Enter height: ", 100, 4096)
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_" + str(width) + 'x' +
                 str(height)).mkdir(parents=True, exist_ok=True)
            print(str(width) + ' ' + str(height))

    # for i in range(len(inputFiles)):
    #     command = ["gltf-transform", "uastc",
    #                inputFiles[i], outputFiles[i], "--level", "4", "--rdo", "4", "--zstd", str(zstdLevel), "--verbose"]
    #     # display command
    #     print('\033[92m' + str(command) + '\033[0m')
    #     # run command
    #     subprocess.run(command, shell=True)


command = []

'''
Automatic KTX2 Compressor
'''

# __MAIN__

# Get folder path that contains glb glbfiles
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

# Get option
print()
option = printOption(
    "1. KTX2: ETC1S\n2. KTX2: UASTC\n3. Resize Texture\nSelect option:", 1, 3)
print("\n")


# Create output files names
outputFiles = list(map(createOutputFile, inputFiles))

match option:
    case 1:
        # Create output folder if doesn't exist
        Path(".\\" + inputPath + "_ktx2_etc1s").mkdir(parents=True, exist_ok=True)
        compressETC1S(inputFiles, outputFiles)
    case 2:
        # Create output folder if doesn't exist
        Path(".\\" + inputPath + "_ktx2_uastc").mkdir(parents=True, exist_ok=True)
        compressUASTC(inputFiles, outputFiles)
    case 3:
        # resize
        resizeImages(inputFiles, outputFiles)
