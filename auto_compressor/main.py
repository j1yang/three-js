import subprocess
from pathlib import Path
import glob
from turtle import width
from venv import create
import os
import sys
import pandas as pd


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
    elif option == 2:
        symbol = "_uastc"
    elif option == 3:
        return ''

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


def resizeImages(inputFiles):
    resizeOption = printOption(
        "1. 4K\n2. 2K\n3. 1K\n4. Custom\nSelect resize option: ", 1, 4)

    match resizeOption:
        case 1:
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_4K").mkdir(parents=True, exist_ok=True)
            # Resize image
            resize(4096, 4096, inputFiles, ".\\" + inputPath + "_resize_4K")
        case 2:
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_2K").mkdir(parents=True, exist_ok=True)
            # Resize image
            resize(2048, 2048, inputFiles, ".\\" + inputPath + "_resize_2K")
        case 3:
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_1K").mkdir(parents=True, exist_ok=True)
            # Resize image
            resize(1024, 1024, inputFiles, ".\\" + inputPath + "_resize_1K")
        case 4:
            width = printOption("Enter width: ", 100, 4096)
            height = printOption("Enter height: ", 100, 4096)
            # Create output folder if doesn't exist
            Path(".\\" + inputPath + "_resize_" + str(width) + 'x' +
                 str(height)).mkdir(parents=True, exist_ok=True)
            # Resize image
            resize(width, height, inputFiles, ".\\" + inputPath + "_resize_" + str(width) + 'x' +
                   str(height))


def resize(width, height, inputFiles, folderPath):
    outputFiles = []
    for i in range(len(inputFiles)):
        command = ["gltf-transform", "resize",
                   "--width", str(width), "--height", str(height), inputFiles[i], folderPath + '\\' + Path(str(inputFiles[i])).stem + '.glb', "--verbose"]
        outputFiles.append(folderPath + '\\' +
                           Path(str(inputFiles[i])).stem + '.glb')
        # display command
        print('\033[92m' + str(command) + '\033[0m')
        # run command
        subprocess.run(command, shell=True)

    xlxsPath = str(Path(outputFiles[0]).parent) + "\inspection.xlsx"
    addDataToExcel(outputFiles, xlxsPath)
    print('\033[92m' + "Inspecting Files Completed! \nPath: " +
          xlxsPath + '\033[0m')


def pd_toExcel(data, fileName):
    name = []
    mimeType = []
    resolution = []
    size = []
    gpuSzie = []
    for i in range(len(data)):
        name.append(data[i][0]["name"])
        mimeType.append(data[i][0]["mimeType"])
        resolution.append(data[i][0]["resolution"])
        size.append(data[i][0]["size"])
        gpuSzie.append(data[i][0]["gpuSzie"])

    dfData = {
        'name': name,
        'mimeType': mimeType,
        'resolution': resolution,
        'size(MB)': size,
        'gpuSzie(MB)': gpuSzie
    }

    df = pd.DataFrame(dfData)
    df.to_excel(fileName, index=False)


def caculateValues(data, glbName):
    index = len(data)
    sumsize = 0
    gpuSize = 0
    mimeType = ""
    resolution = ""
    for i in range(0, index):
        grid = data[i].split(',')
        if grid[0] != '':
            sumsize += float(grid[7])
            gpuSize += float(grid[8])
            if grid[6] > resolution:
                resolution = grid[6]
            if i == 0:
                mimeType = grid[5]
                resolution = grid[6]
        else:
            break

    data = [{
        'name': glbName,
        'mimeType': mimeType,
        'resolution': resolution,
        'size': sumsize/1000000,
        'gpuSzie': gpuSize/1000000
    }]

    return data


def addDataToExcel(inputFiles, xlxsName):
    datas = []
    for i in range(len(inputFiles)):
        command = ["gltf-transform", "inspect",
                   inputFiles[i], "--format", "csv"]
        result = subprocess.Popen(
            command, shell=True, stdout=subprocess.PIPE, encoding="utf-8")
        out, err = result.communicate()
        result = out.splitlines()
        # print(result)
        for line in result:
            if line == ' TEXTURES':
                data = result[result.index(line)+3:result.index(" ANIMATIONS")]
                # write_excel_xls("x.xls", "sheet1", value)
                datas.append(caculateValues(data, inputFiles[i]))
    pd_toExcel(datas, xlxsName)


'''
Automatic KTX2 Compressor
'''

# __MAIN__
command = []


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
xlxsPath = str(Path(outputFiles[0]).parent) + "\inspection.xlsx"
match option:
    case 1:
        # Create output folder if doesn't exist
        Path(".\\" + inputPath + "_ktx2_etc1s").mkdir(parents=True, exist_ok=True)
        compressETC1S(inputFiles, outputFiles)
        addDataToExcel(outputFiles, xlxsPath)
        print('\033[92m' + "Inspecting Files Completed! \nPath: " +
              xlxsPath + '\033[0m')
    case 2:
        # Create output folder if doesn't exist
        Path(".\\" + inputPath + "_ktx2_uastc").mkdir(parents=True, exist_ok=True)
        compressUASTC(outputFiles, outputFiles)
        print('\033[92m' + "Inspecting Files Completed! \nPath: " +
              xlxsPath + '\033[0m')
    case 3:
        # resize
        resizeImages(inputFiles)
