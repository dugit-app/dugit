# Dugit

GitHub Classroom tools for Drury University.

[![Version](https://img.shields.io/npm/v/dugit.svg)](https://npmjs.org/package/dugit)

## Todo

- [ ] Put development guide in the repo
- [ ] Add testing somehow
- [ ] Grade and TA info stored in a repo for each org
- [ ] Consider replacing local git cloning with workflows

## Startup

- [x] Auto check if git is installed
- [x] Auto check for update on start
- [x] Auto start login if not logged in

## Prompt structure

- Manage grades
    - Select classroom
        - Select assignment
            - New grade
            - Pull grades from TA repo
            - Remove grade
                - Delete repos option
- Manage teaching assistants
    - Select classroom
        - Add TA
        - Edit TA
        - Remove TA
- Manage repositories
    - Select organization
        - Delete one or more repositories
            - Multi-select repositories
                - Confirm
                - Cancel
- Usage instructions
    - Open markdown file in github repo with the following:
    - [Link to GitHub App](https://github.com/apps/dugit-app/installations/select_target)
    - Basic workflow explanation
- Logout
- Exit
