import * as THREE from 'three'
import { getScreenRanges, mapRangetoRange } from './coordinants'

const videoAspectRatio: number = 1280 / 720
const screenRange = getScreenRanges(videoAspectRatio, 4)

export function flattenFacialLandMarkArray(data: vector[]): any[] {
    let array: number[] = []

    data.forEach((el) => {
        el.x = mapRangetoRange(500 / videoAspectRatio, el.x, screenRange.height) - 1
        el.y = mapRangetoRange(500 / videoAspectRatio, el.y, screenRange.height, true) + 1
        el.z = (el.z / 100) * -1 + 0.5

        array = [...array, ...Object.values(el)]
    })

    return array.filter((el) => typeof el === 'number')
}

export function getFaceGeometry(array: number[]): THREE.BufferGeometry {
    const BufferGeometry = new THREE.BufferGeometry()
    const positionArray = new Float32Array(array)
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
    BufferGeometry.setAttribute('position', positionAttribute)

    return BufferGeometry
}

export function createBufferAttribute(data: number[]): THREE.BufferAttribute {
    const positionArray = new Float32Array(data)
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
    return positionAttribute
}

export function updateGeometry(
    BufferGeometry: THREE.BufferGeometry,
    attribute: THREE.BufferAttribute,
    name: string
) {
    BufferGeometry.setAttribute(name, attribute)
    BufferGeometry.attributes[name].needsUpdate = true
}

export function vertexObjectToVertice(data: vector[]): THREE.Vector3[] {
    let array: THREE.Vector3[] = []
    data.forEach((point) => {
        const v = new THREE.Vector3(point.x, point.y, point.z)
        array = [...array, v]
    })
    return array
}

function getVectorsFromBufferArray(
    indexes: number[],
    Attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
    z: number
) {
    const vectorArray: THREE.Vector3[] = []

    indexes.forEach((index, i) => {
        const vector = new THREE.Vector3(
            Attribute.getX(index),
            Attribute.getY(index),
            Attribute.getZ(index)
        )
        vectorArray.push(vector)
    })

    return vectorArray
}

function flattenVector3Array(vectorArray: THREE.Vector3[]) {
    let array: number[] = []

    vectorArray.forEach((vector) => {
        array = [...array, vector.x, vector.y, vector.z]
    })

    return array
}

export function updatePlaneBuffer(
    center: number,
    positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
    updateGeometry: THREE.BufferGeometry
) {
    const points = getVectorsFromBufferArray([234, 152, 454, 234, 454, 10], positions, center)
    const positionAttribute = new THREE.BufferAttribute(
        new Float32Array(flattenVector3Array(points)),
        3
    )
    updateGeometry.setAttribute('position', positionAttribute)
    updateGeometry.attributes.position.needsUpdate = true
}
