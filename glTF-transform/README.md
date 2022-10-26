<!-- glTF-Transform -->

https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md
https://gltf-transform.donmccurdy.com/cli.html

<!-- Method 1: UASTC + ETC1S -->

gltf-transform uastc input.glb output1.glb --level 4 --rdo 4 --slots "{normalTexture,occlusionTexture,metallicRoughnessTexture}" --zstd 18 --verbose

gltf-transform etc1s output1.glb output2.glb --quality 255 --verbose

<!-- METHOD 2: UASTC -->

gltf-transform uastc input.glb output.glb --level 4 --rdo 4 --zstd 18 --verbose

<!-- METHOD 3: ETC1S -->

gltf-transform etc1s input.glb output.glb --verbose

try:
gltf-transform etc1s .\base_in\Avatar_jt.glb .\etc1s_out\Avatar_jt.glb

<!-- Evaluating the Output -->

gltf-transform inspect input.glb --format md

use inspect command to examine the file size for each texture and the sizes they will be in GPU memory.

<!-- Execuution error: running scripts is disabled on this system. For more information, see about_Execution_Policies-->

Powershell as Admin,
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
