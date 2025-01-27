# Dugit

GitHub Classroom tools for Drury University.

[![Version](https://img.shields.io/npm/v/dugit.svg)](https://npmjs.org/package/dugit)

## Installation

- Install [Node.js](https://nodejs.org/en/download)
- Install Dugit with `npm install -g dugit`
- Install the [Dugit GitHub App]('https://github.com/apps/dugit-app/installations/select_target') on each organization
  that Dugit will be used for

## Usage

The primary purpose of Dugit is to allow teaching assistants to anonymously grade GitHub Classroom assignments.

The typical workflow of Dugit is as follows:

- Run Dugit in a terminal with: `dugit`
- Add teaching assistants to a classroom: `Manage graders > Add grader`
    - To maintain the anonymity of students, teaching assistants should not be given admin access to the classroom
      organization
- Add a new grade for an assignment: `Manage grades > Add grade`
    - Each GitHub Classroom assignment can have multiple grades if needed
    - Adding a grade will generate anonymous copies of each student's repository for the assignment
    - Each anonymous repository is given a memorable randomized name
    - The teaching assistants added to the classroom will automatically be given access to the anonymous repositories
    - A repository for the instructor will be generated that maps each student's name to their anonymous name and links
      to the original and anonymous repositories
    - A repository for the teaching assistants will be generated that only has the anonymous names and links to the
      anonymous repositories
    - The teaching assistants can then record grades for each anonymous name and give the grades to the instructor
    - The instructor can then record grades for each student by using the instructor repository to map between the
      anonymous names and the student names
- After grades are recorded, the anonymous repositories can be deleted: `Manage grades > Remove grade`
- An additional feature of Dugit allows organization repositories to be easily deleted:
  `Manage repositories > Select repositories to delete`
- This usage guide can be opened with: `Help`

## Development

- Install [Node.js](https://nodejs.org/en/download)
- Clone this repository with `git clone https://github.com/dugit-app/dugit`
- Install dependencies with `npm install`
