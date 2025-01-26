# Dugit

GitHub Classroom tools for Drury University.

[![Version](https://img.shields.io/npm/v/dugit.svg)](https://npmjs.org/package/dugit)

## Todo

- [ ] Put development guide in the repo
- [ ] Add testing somehow (use dugit-testing-classroom with the dugit org, and setup for edge cases)
- [ ] Consider replacing local git cloning with workflows
- [ ] Create dugit organization and move the project there
- [ ] Consider replacing complicated json thing with just spreadsheet link
  - No pulling grades
  - Teacher repo: anonymous name maps and links to student and anonymous repos, link to TA repo
  - TA repo: links to anonymous repos
  - TA can add link to spreadsheet in repo where they put in grades for each anonymous name
- [ ] Clean up / standardize exports, consider a different folder structure
- [ ] Wrap API function structure
- [ ] Catch error when Dugit GitHub app isn't installed, and link to it
- [ ] Consider limiting grades to one per assignment (prob not cuz sprints, but maybe)
- [ ] Sort imports
- [ ] Test with older versions of Node
- [ ] Rename TA to grader?
- [ ] Rename instances of repository to repo
- [ ] Shorten anonymous to anon?
- [ ] Address freezing when hitting stop after adding a grade? Have to hit ctrl c to kill
- [ ] Catch ta username doesn't exist errors

- TODO: Create repos (put functions in separate files, put function params in objects)
- TODO: Add spinner feedback

- repo prefix: github.com/org/assignment.slug-slug(grade.name)-
- markdown builder - create headers -> separate function
- get accepted assignments
- for each:
  - generate anonymous name -> separate function
  - generate anonymous repo -> separate function (repo prefix, anonymous name)
  - md builder - add line -> separate function
- add name map to configRepo
create teacher and ta repos with md files -> separate function (repo prefix, name map)

## Prompt structure

- Manage grades
    - Select classroom
        - Select assignment
            - New grade
            - Remove grade (delete repos)
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
    - Open markdown file in GitHub repo with the following:
    - [Link to GitHub App](https://github.com/apps/dugit-app/installations/select_target)
    - Basic workflow explanation
- Logout
- Exit
