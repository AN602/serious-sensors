import { dot, cross, multiply, subtract, add } from "mathjs";

export class UnitQuaternion {

    constructor(private i: number, private j: number, private k: number, private w: number) { }

    static fromArray(array: number[]): UnitQuaternion | null {
        return array.length === 4 ? new UnitQuaternion(array[0], array[1], array[2], array[3]) : null;
    }

    static rotateVectorByQuaternion(vector: number[], quaternion: UnitQuaternion) {
        const qVector = new Array(quaternion.i, quaternion.j, quaternion.k);
        const scalar = quaternion.w;

        const a = multiply(multiply(2, dot(qVector, vector)), qVector);
        const b = multiply(
            subtract(scalar * scalar, dot(qVector, qVector)),
            vector
        );
        const c = multiply(2 * scalar, cross(qVector, vector));

        return add(add(a, b), c);
    }
}

