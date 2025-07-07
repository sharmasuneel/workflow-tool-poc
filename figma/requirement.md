1	Functional Workflow	The Task should be auto triggered to the User based on assigned Start
date and should have an End date	
Must Have	
Parameters on Start
1. Manually triggered (Yes/No)
2. Start Working Day
3. Start Time

2	Functional Workflow	The assigned owner should be able to mark the task as completed or
assign it to a new owner	
Must Have	
On Task level screen

3	Functional Workflow	The tool should be able to auto generate reminders to the assigned
owner in event of a delay	
Must Have	
Parameters on each task
1. Auto reminders (Yes/No)
2.Mins before task due to remind
3. Mins after task due to remind
4. Mins after above reminder to escalate

4	Functional Workflow	The tool should activate a dependent task as soon as the precedent
task is completed	
Must Have	
Part of execution engine

5	Functional Workflow	The User (FC team/Task owners) should be able to re-open a
previously closed task and add updated documents	
Must Have	
Part of execution - need clarification re
whether process owner only, or task owner as well

6	Functional Workflow	The User (FC team/Task owners) should be able to update comments
in the tasks which should be visible to other users in the main screen as a notification	
Must Have	
Parameter for each task:
1. Capture comment on task
Need clarification about who should be able to see comment

7	Functional Workflow	The FC Team should be able to upload fresh templates into the Tasks	
Must Have	
Parameter for file upload task:
1. Retain uploaded file for next execution date

8	Functional Workflow	The tool should allow the FC team to modify tasks due dates	
Must Have	
Parameter for each task:
1. Target working day for completion
2. Target time for completion
Ability to update this with specific dates and
time on execution process map

9	Non-Functional	The tool needs to have defined Static table of user details, including
escalation matrix	
Must Have	
Screen for user details - BRID, Name, email,
escalation name, escalation email With file upload feature

10	Non-Functional	The tool should be able to roll forward static user data	
Must Have	
Check whether we can retain user data, until
overridden or changed

11	Functional - Query Management	The User (FC team/Task owners) should be able to raise query to the
assigned owner for the tasks directly from the Task UI	
Must Have	
Parameter for each task:
1. Enable query finctionality Check with users about who the query can be assigned to

12	Functional - Query Management	The User (FC team/Task owners) should be able to respond to the query directly from the Task UI	
Must Have	
Delivered via task screen

13	Functional - Query Management	The User (FC team/Task owners) should be able to manually trigger reminders to the assigned owner in event of delay in response to the query directly from the Task UI	
Must Have	
Process execution dashboard to have
buttons for each task - Send reminder, Send Escalation

14	Functional - Query Management	The User (FC team/Task owners) should be able to close query if satisfied with the response directly from the Task UI	
Must Have	
Query functionality to have close query
option. Until then status will be pending query

15	Functional - Query Management	Built in Dependency between Query and Outcome/Taski.e without the
closure of the query the Outcome/Task cannot be completed	
Must Have	
Part of execution engine. Cannot close task without queries being closed

16	Functional - Dashboard	The Dashboard should reflect the Completed tasks and Tasks
reassigned	
Must Have	
Process execution dashboard to have process view as well as Table view

17	Functional - Dashboard	The tool should have a Dashboard that reports status update through
graphs with RAG status with option to view the status at multiple levels
of business process hierarchy	
Must Have	
We need to spec this out - need clarifications on how the workflows will be grouped

18	Non-Functional	The tool should have defined audit trail	
Must Have	
Tech implementation to get all details of each execution

19	Non-Functional	The tool should have inbuilt controls as defined by the FC team	
Must Have	
Need clarifications on what controls

20	Non-Functional	The Data back up and frequency should be defined	
Must have	
Clarify if daily backup is adequate, with DR availability as well

21	Non-Functional	The FC Team should be able define roles for the users in the tool	
Must have	
Parameters for Start:
1. Roles for this workflow (multiple roles)
2. Users for each role (multiple users for each role)

22	Non-Functional	The tool should be able to maintain version controls of the files	
Must have	
Clarify this requirement

23	Non-Functional	The tool should have a user guide for knowledge transfer to the new users	
Must have	
Documentation

24	Non-Functional	The tools Ul needs to be standard across the reporting types	
Must have	
UX Requirement

25	Non-Functional	The tool should be able to update the new assigned owners into its database	
Must have	
Parameter for start:
Process Owner - Are multiple required
Clarify who can access the workflow definition

26	Functional Workflow	The Cycle owner has to be the approver of all critical changes such as due dates	
Must have	
During execution, request process owner for approval for every date/time change Clarify if there is a different process owner and cycle owner

27	Non-Functional	The Change log should be visible containing all changes made to user and task details	
Must have	
Clarify

28	Non-Functional	The Audit trail needs to be visible to all owners.	
Must have	
Clarify
