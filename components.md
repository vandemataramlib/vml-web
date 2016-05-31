# View document

- Main content
    - Header
        - Title
        - Subtitle
        - Page View Settings
    - Body
        - Verses
            - Verse
                - Annotation indicator
                - Expand to view actions
                - Detailed view
- Left Sidebar
    - Volume TOC

- Right Sidebar
    - Chapter sections


# flow

normal page load: only get verses
hover: pre-emptively fetch verse data, cache in store
click: show fetched verse data, or fetch it on the fly if not available, cache in store

page load with selected verses: get all verses, also get verse data for selected verses, cache in store
page load with selected verses SSR: render all verses, on mount get verse data for selected verses, cache in store

GET /documents/:documentId
GET /documents/:documentId?fetchVerseData=true&selectedVerses=1,5,7
GET /documents/:documentId/verses/:verseId
GET /documents/:documentId/verses/:verseId?fetchVerseData=true

