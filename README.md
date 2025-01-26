# Dugit

GitHub Classroom tools for Drury University.

[![Version](https://img.shields.io/npm/v/dugit.svg)](https://npmjs.org/package/dugit)

## Todo

- [ ] Put development guide in the repo
- [ ] Add testing somehow
- [ ] Consider replacing local git cloning with workflows
- [ ] Create dugit organization and move the project there
- [ ] Consider replacing complicated json thing with just spreadsheet link
  - No pulling grades
  - Teacher repo: anonymous name maps and links to student and anonymous repos, link to TA repo
  - TA repo: links to anonymous repos
  - TA can add link to spreadsheet in repo where they put in grades for each anonymous name

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
