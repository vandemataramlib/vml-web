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

Web urls

/:documentSlug - /Ishopanishad#5, /mahAbharata, /yajurveda, /rAmAyana
    documentStructure = single | volume | collection
    structure = "verses" | "books.parts.chapters.verses" | "chapters.verses" | "books.chapters.verses"
    examples: vandemataramlibrary.org/Ishopanishad === vandemataramlibrary.org/ishopanishad
              vandemataramlibrary.org/mahAbhArata === vandemataramlibrary.org/mahabharata
/:documentSlug/:documentPart -  /mahAbharata/05, /rigveda/01, /bhAgavadgItA/18#4-5
    documentPartType = parva | mandala | adhyaya
    structure = "chapters." | 
/:documentSlug/:documentPart/:chapterUrl - /mahAbharata/05/01#18, /rigveda/01/01#23


editions: {
    id: "xyz",
    docTitleEN: "Mahabharata",
    docTitleITRANS: "mahAbhArata",
    baseEdition: {
        docID: "def",
        // name: "Traditional"
        docURL: "/mahAbhArata",
        translations: [
            {
                lang: Language.EN,
                docID: "abcd",
                url: "/mahAbhArata?translation=en",
            }
        ]
    },
    otherEditions: [{
        docID: "abc",
        name: "BORI",
        url: "/mahAbhArata?edition=bori",
        translations: [
            {
                lang: Language.EN,
                docID: "abcde",
                url: "/mahAbhArata?edition=bori&translation=en",
            }
        ]
    }]
}

document: {
    id: "def",
    url: "/mahAbhArata",
    titleEN: "Mahabharata",
    titleITRANS: "mahAbhArata",
    // edition: "default",
    structure: DocumentStructure.Volume,
    type: DocumentType.Original
}

document: {
    id: "abc",
    url: "/mahAbhArata?edition=bori",
    titleEN: "Mahabharata",
    titleITRANS: "mahAbhArata",
    edition: "BORI",
    structure: DocumentStructure.Volume,
    type: DocumentType.Original
}


document: {
    id: "abcd",
    url: "/mahAbhArata?translation=en",
    titleEN: "Mahabharata",
    titleITRANS: "mahAbhArata",
    structure: DocumentStructure.Volume,
    type: DocumentType.Translation
}

document: {
    id: "abcde",
    url: "/mahAbhArata?edition=bori&translation=en",
    titleEN: "Mahabharata",
    titleITRANS: "mahAbhArata",
    edition: "BORI",
    structure: DocumentStructure.Volume,
    type: DocumentType.Translation
}





{
    title,
    slug,
    type,
    toc,
    sub: {
        "01": {
            verses: [
                {
                    lines: [
                        words: [

                        ]
                    ]
                }
            ]
        }
    }
}


Todos
1. Jump to specified paragraph(s)
2.  