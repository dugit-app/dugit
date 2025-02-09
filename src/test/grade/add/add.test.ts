import { getAssignment } from '@/test/grade/assignment.js'
import { addGrade } from '@/utils/grade/add/add.js'
import { removeGrade } from '@/utils/grade/remove/remove.js'
import { expect, test } from 'vitest'

test('creates new grade', { timeout: 0 }, async () => {
    await expect(add()).resolves.toBe(true)
})

test('removes the new grade', { timeout: 0 }, async () => {
    await expect(remove()).resolves.toBe(true)
})

async function add(): Promise<boolean> {
    const { assignment, classroom } = await getAssignment()

    await addGrade('Test', assignment, classroom)

    return Promise.resolve(true)
}

async function remove(): Promise<boolean> {
    const { assignment, classroom } = await getAssignment()

    await removeGrade('Test', assignment, classroom)

    return Promise.resolve(true)
}
