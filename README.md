# AltspaceVR Programming Project - Spaces Admin Web Frontend
Instructions:

To run the project:
http-server -o index.html

Loading Screen:
Displays existing space information

Edit Space favIcon:
Allows User to edit existing space information.
The boolean values are shown as radio buttons as a space can have only one of those values
There is a provision to Add member on clicking +Add Member
Delete favIcon beside the name allows user to delete member

Delete Space favIcon:
Allows User to delete existing space.

Create Space Icon (Top right corner header bar):
Allows User to create new Space.
The created by field defaults to Admin Istrator
There is a provision to Add member on clicking +Add Member
Delete favIcon beside the name allows user to delete member

Delete multiple spaces:
Onclick of "Select multiple spaces" on the top right corner, checkboxes appear on the spaces. User can select the spaces to delete and click on "Click to delete" text on the top right corner.

Searching spaces:
OnClick of searchIcon after typing in the text to search,the search bar allows users to search spaces by text present in the title or description.

Statistics:
The stat text on the top right corner takes the user to statistics page.
Pie depicts the number of members/visitors present in every space as compared to those within different types of spaces.
The number of visitors is calculated by the number of times a user clicks the edit button(assumption).
Another useful statistics could be depiction of visitors vs members within a space.
User can go back to the main page by clicking on "Back To Admin"

Refreshing the page loads the initial dataset as present in db.json
