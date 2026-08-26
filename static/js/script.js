/* =========================================================
   NUSHX — AI PDF ASSISTANT
   Main Frontend JavaScript

   Pipeline:
   PDF Upload
       ↓
   Text Extraction
       ↓
   Chunking
       ↓
   TF-IDF
       ↓
   Cosine Similarity
       ↓
   Top Relevant Chunks
       ↓
   Groq AI
       ↓
   Answer
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let selectedPDF = null;

let documentUploaded = false;

let isAsking = false;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const pdfFile =
    document.getElementById("pdfFile");

const uploadArea =
    document.getElementById("uploadArea");

const uploadBtn =
    document.getElementById("uploadBtn");

const selectedFile =
    document.getElementById("selectedFile");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const removeFile =
    document.getElementById("removeFile");

const uploadStatus =
    document.getElementById("uploadStatus");

const pageCount =
    document.getElementById("pageCount");

const chunkCount =
    document.getElementById("chunkCount");

const questionBox =
    document.getElementById("questionBox");

const askBtn =
    document.getElementById("askBtn");

const chatBox =
    document.getElementById("chatBox");

const apiKey =
    document.getElementById("apiKey");

const apiStatus =
    document.getElementById("apiStatus");

const contextText =
    document.getElementById("contextText");

const contextCount =
    document.getElementById("contextCount");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeUpload();

        initializeChat();

        initializeSuggestions();

        initializeAPIKey();

        initializeDragAndDrop();

        initializeKeyboardShortcuts();

        console.log(
            "NUSHX initialized successfully."
        );

    }
);


/* =========================================================
   UPLOAD INITIALIZATION
========================================================= */

function initializeUpload() {

    if (pdfFile) {

        pdfFile.addEventListener(
            "change",
            handleFileSelection
        );

    }


    if (uploadBtn) {

        uploadBtn.addEventListener(
            "click",
            uploadPDF
        );

    }


    if (removeFile) {

        removeFile.addEventListener(
            "click",
            clearSelectedFile
        );

    }

}


/* =========================================================
   FILE SELECTION
========================================================= */

function handleFileSelection(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    validateAndSelectFile(file);

}


/* =========================================================
   VALIDATE FILE
========================================================= */

function validateAndSelectFile(file) {

    const maxSize =
        25 * 1024 * 1024;


    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {

        showUploadError(
            "Only PDF files are supported."
        );

        return;

    }


    if (file.size > maxSize) {

        showUploadError(
            "PDF must be smaller than 25 MB."
        );

        return;

    }


    selectedPDF = file;


    displaySelectedFile(file);


    resetDocumentState();

}


/* =========================================================
   DISPLAY SELECTED FILE
========================================================= */

function displaySelectedFile(file) {

    if (fileName) {

        fileName.textContent =
            file.name;

    }


    if (fileSize) {

        fileSize.textContent =
            formatFileSize(file.size);

    }


    if (selectedFile) {

        selectedFile.classList.add(
            "visible"
        );

    }


    setUploadStatus(
        "File selected. Ready to process.",
        "processing"
    );

}


/* =========================================================
   FORMAT FILE SIZE
========================================================= */

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, index)
            ).toFixed(2)
        )
        +
        " "
        +
        units[index]
    );

}


/* =========================================================
   CLEAR FILE
========================================================= */

function clearSelectedFile(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }


    selectedPDF = null;

    documentUploaded = false;


    if (pdfFile) {
        pdfFile.value = "";
    }


    if (selectedFile) {

        selectedFile.classList.remove(
            "visible"
        );

    }


    if (pageCount) {
        pageCount.textContent = "—";
    }


    if (chunkCount) {
        chunkCount.textContent = "—";
    }


    setUploadStatus(
        "No document loaded.",
        ""
    );


    resetPipeline();


    clearContext();

}


/* =========================================================
   RESET DOCUMENT STATE
========================================================= */

function resetDocumentState() {

    documentUploaded = false;


    if (pageCount) {
        pageCount.textContent = "—";
    }


    if (chunkCount) {
        chunkCount.textContent = "—";
    }


    resetPipeline();

}


/* =========================================================
   UPLOAD PDF
========================================================= */

async function uploadPDF() {

    if (!selectedPDF) {

        showUploadError(
            "Please select a PDF first."
        );

        return;

    }


    if (!uploadBtn) {
        return;
    }


    setButtonLoading(
        uploadBtn,
        true
    );


    setUploadStatus(
        "Uploading and processing PDF...",
        "processing"
    );


    /* -----------------------------------------------------
       PIPELINE — UPLOAD
    ----------------------------------------------------- */

    setPipelineStep(
        1,
        "active"
    );


    try {

        const formData =
            new FormData();


        formData.append(
            "pdf",
            selectedPDF
        );


        const response =
            await fetch(
                "/upload",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "PDF processing failed."
            );

        }


        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        documentUploaded = true;


        if (pageCount) {

            pageCount.textContent =
                data.pages ?? "—";

        }


        if (chunkCount) {

            chunkCount.textContent =
                data.chunks ?? "—";

        }


        setUploadStatus(
            "PDF processed successfully.",
            "success"
        );


        /* -------------------------------------------------
           PIPELINE COMPLETE
        ------------------------------------------------- */

        setPipelineStep(
            1,
            "completed"
        );

        setPipelineStep(
            2,
            "completed"
        );

        setPipelineStep(
            3,
            "completed"
        );

        setPipelineStep(
            4,
            "active"
        );


        /* -------------------------------------------------
           CHAT MESSAGE
        ------------------------------------------------- */

        addMessage(
            "ai",
            `Your PDF is ready. I processed ${data.pages} page(s) and created ${data.chunks} searchable chunk(s). Enter your Groq API key and ask me anything about the document.`
        );


    } catch (error) {

        console.error(
            "NUSHX Upload Error:",
            error
        );


        setUploadStatus(
            error.message ||
            "Unable to process PDF.",
            "error"
        );


        setPipelineStep(
            1,
            "error"
        );


    } finally {

        setButtonLoading(
            uploadBtn,
            false
        );

    }

}


/* =========================================================
   DRAG AND DROP
========================================================= */

function initializeDragAndDrop() {

    if (!uploadArea) {
        return;
    }


    uploadArea.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();

            uploadArea.classList.add(
                "drag-over"
            );

        }
    );


    uploadArea.addEventListener(
        "dragleave",
        () => {

            uploadArea.classList.remove(
                "drag-over"
            );

        }
    );


    uploadArea.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();


            uploadArea.classList.remove(
                "drag-over"
            );


            const file =
                event.dataTransfer.files[0];


            if (file) {

                validateAndSelectFile(
                    file
                );

            }

        }
    );

}


/* =========================================================
   CHAT INITIALIZATION
========================================================= */

function initializeChat() {

    if (!askBtn) {
        return;
    }


    askBtn.addEventListener(
        "click",
        askQuestion
    );

}


/* =========================================================
   ASK QUESTION
========================================================= */

async function askQuestion() {

    if (isAsking) {
        return;
    }


    /* -----------------------------------------------------
       CHECK DOCUMENT
    ----------------------------------------------------- */

    if (!documentUploaded) {

        addMessage(
            "ai",
            "Please upload and process a PDF before asking a question."
        );

        return;

    }


    /* -----------------------------------------------------
       QUESTION
    ----------------------------------------------------- */

    const question =
        questionBox
            ? questionBox.value.trim()
            : "";


    if (!question) {

        showQuestionError(
            "Please enter a question."
        );

        return;

    }


    /* -----------------------------------------------------
       API KEY
    ----------------------------------------------------- */

    const key =
        apiKey
            ? apiKey.value.trim()
            : "";


    if (!key) {

        addMessage(
            "ai",
            "Please enter your Groq API key first. You can find instructions in the Groq API Key section."
        );


        if (apiKey) {
            apiKey.focus();
        }


        return;

    }


    /* -----------------------------------------------------
       START
    ----------------------------------------------------- */

    isAsking = true;


    setButtonLoading(
        askBtn,
        true
    );


    addMessage(
        "user",
        question
    );


    if (questionBox) {
        questionBox.value = "";
    }


    clearContext();


    addTypingIndicator();


    /* -----------------------------------------------------
       PIPELINE
    ----------------------------------------------------- */

    setPipelineStep(
        4,
        "active"
    );

    setPipelineStep(
        5,
        "active"
    );

    setPipelineStep(
        6,
        "active"
    );


    try {

        /* -------------------------------------------------
           BACKEND REQUEST
        ------------------------------------------------- */

        const response =
            await fetch(
                "/ask",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        question:
                            question,

                        api_key:
                            key

                    })

                }
            );


        const data =
            await response.json();


        removeTypingIndicator();


        /* -------------------------------------------------
           ERROR
        ------------------------------------------------- */

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Unable to generate an answer."
            );

        }


        /* -------------------------------------------------
           RETRIEVAL COMPLETED
        ------------------------------------------------- */

        setPipelineStep(
            4,
            "completed"
        );

        setPipelineStep(
            5,
            "completed"
        );

        setPipelineStep(
            6,
            "completed"
        );


        /* -------------------------------------------------
           GROQ
        ------------------------------------------------- */

        setPipelineStep(
            7,
            "active"
        );


        addMessage(
            "ai",
            data.answer
        );


        /* -------------------------------------------------
           CONTEXT
        ------------------------------------------------- */

        updateContext(
            data.context,
            data.chunks_retrieved
        );


        /* -------------------------------------------------
           GROQ COMPLETE
        ------------------------------------------------- */

        setPipelineStep(
            7,
            "completed"
        );


    } catch (error) {

        removeTypingIndicator();


        console.error(
            "NUSHX Ask Error:",
            error
        );


        addMessage(
            "ai",
            formatErrorMessage(
                error.message
            )
        );


        setPipelineStep(
            7,
            "error"
        );


    } finally {

        isAsking = false;


        setButtonLoading(
            askBtn,
            false
        );

    }

}


/* =========================================================
   ADD CHAT MESSAGE
========================================================= */

function addMessage(
    sender,
    text
) {

    if (!chatBox) {
        return;
    }


    const emptyChat =
        chatBox.querySelector(
            ".empty-chat"
        );


    if (emptyChat) {
        emptyChat.remove();
    }


    const message =
        document.createElement(
            "div"
        );


    message.className =
        `message ${sender}`;


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "message-bubble";


    if (sender === "ai") {

        bubble.innerHTML =
            formatAIText(text);

    } else {

        bubble.textContent =
            text;

    }


    message.appendChild(
        bubble
    );


    chatBox.appendChild(
        message
    );


    scrollChatToBottom();

}


/* =========================================================
   FORMAT AI TEXT
========================================================= */

function formatAIText(text) {

    if (!text) {
        return "";
    }


    let formatted =
        escapeHTML(text);


    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function addTypingIndicator() {

    if (!chatBox) {
        return;
    }


    const indicator =
        document.createElement(
            "div"
        );


    indicator.className =
        "message ai";

    indicator.id =
        "typingIndicator";


    indicator.innerHTML = `

        <div class="message-bubble">

            <span class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </span>

        </div>

    `;


    chatBox.appendChild(
        indicator
    );


    scrollChatToBottom();

}


/* =========================================================
   REMOVE TYPING INDICATOR
========================================================= */

function removeTypingIndicator() {

    const indicator =
        document.getElementById(
            "typingIndicator"
        );


    if (indicator) {
        indicator.remove();
    }

}


/* =========================================================
   SCROLL CHAT
========================================================= */

function scrollChatToBottom() {

    if (!chatBox) {
        return;
    }


    chatBox.scrollTop =
        chatBox.scrollHeight;

}


/* =========================================================
   SUGGESTIONS
========================================================= */

function initializeSuggestions() {

    const suggestions =
        document.querySelectorAll(
            ".suggestion"
        );


    suggestions.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question;


                    if (questionBox) {

                        questionBox.value =
                            question;

                        questionBox.focus();

                    }

                }
            );

        }
    );

}


/* =========================================================
   API KEY
========================================================= */

function initializeAPIKey() {

    if (!apiKey) {
        return;
    }


    apiKey.addEventListener(
        "input",
        () => {

            const value =
                apiKey.value.trim();


            if (!value) {

                updateAPIStatus(
                    "API key required",
                    "error"
                );

                return;

            }


            if (
                value.startsWith("gsk_")
            ) {

                updateAPIStatus(
                    "Key entered",
                    "success"
                );

            } else {

                updateAPIStatus(
                    "Check key format",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   API STATUS
========================================================= */

function updateAPIStatus(
    text,
    type
) {

    if (!apiStatus) {
        return;
    }


    apiStatus.textContent =
        text;


    apiStatus.classList.remove(
        "success",
        "error"
    );


    if (type) {

        apiStatus.classList.add(
            type
        );

    }

}


/* =========================================================
   CONTEXT PANEL
========================================================= */

function updateContext(
    context,
    count
) {

    if (contextText) {

        contextText.textContent =
            context ||
            "No retrieved context.";

    }


    if (contextCount) {

        const chunks =
            Number(count) || 0;


        contextCount.textContent =
            `${chunks} ${
                chunks === 1
                    ? "chunk"
                    : "chunks"
            }`;

    }

}


/* =========================================================
   CLEAR CONTEXT
========================================================= */

function clearContext() {

    if (contextText) {

        contextText.textContent =
            "Relevant document context will appear here after asking a question.";

    }


    if (contextCount) {

        contextCount.textContent =
            "0 chunks";

    }

}


/* =========================================================
   PIPELINE
========================================================= */

function setPipelineStep(
    stepNumber,
    state
) {

    const step =
        document.querySelector(
            `.pipeline-step[data-step="${stepNumber}"]`
        );


    if (!step) {
        return;
    }


    step.classList.remove(
        "active",
        "completed",
        "error"
    );


    if (state) {

        step.classList.add(
            state
        );

    }


    /* -----------------------------------------------------
       COMPLETED NUMBER
    ----------------------------------------------------- */

    const number =
        step.querySelector(
            ".step-number"
        );


    if (
        number &&
        state === "completed"
    ) {

        number.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }

}


/* =========================================================
   RESET PIPELINE
========================================================= */

function resetPipeline() {

    const steps =
        document.querySelectorAll(
            ".pipeline-step"
        );


    steps.forEach(
        (step, index) => {

            step.classList.remove(
                "active",
                "completed",
                "error"
            );


            const number =
                step.querySelector(
                    ".step-number"
                );


            if (number) {

                number.textContent =
                    String(index + 1)
                        .padStart(2, "0");

            }

        }
    );


    /* First step is ready */

    setPipelineStep(
        1,
        "active"
    );

}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.classList.add(
            "loading"
        );

        button.disabled =
            true;

    } else {

        button.classList.remove(
            "loading"
        );

        button.disabled =
            false;

    }

}


/* =========================================================
   UPLOAD STATUS
========================================================= */

function setUploadStatus(
    message,
    type
) {

    if (!uploadStatus) {
        return;
    }


    uploadStatus.innerHTML = `

        <i class="${
            type === "success"
                ? "fa-solid fa-circle-check"
                : type === "error"
                ? "fa-solid fa-circle-exclamation"
                : "fa-solid fa-circle-info"
        }"></i>

        ${escapeHTML(message)}

    `;


    uploadStatus.classList.remove(
        "processing",
        "success",
        "error"
    );


    if (type) {

        uploadStatus.classList.add(
            type
        );

    }

}


/* =========================================================
   UPLOAD ERROR
========================================================= */

function showUploadError(
    message
) {

    setUploadStatus(
        message,
        "error"
    );

}


/* =========================================================
   QUESTION ERROR
========================================================= */

function showQuestionError(
    message
) {

    addMessage(
        "ai",
        message
    );

}


/* =========================================================
   FRIENDLY ERROR
========================================================= */

function formatErrorMessage(
    message
) {

    if (!message) {

        return (
            "Something went wrong. " +
            "Please try again."
        );

    }


    const lower =
        message.toLowerCase();


    if (
        lower.includes(
            "invalid"
        ) &&
        lower.includes(
            "api"
        )
    ) {

        return (
            "Your Groq API key appears to be " +
            "invalid. Please check the key and try again."
        );

    }


    if (
        lower.includes("authentication") ||
        lower.includes("401")
    ) {

        return (
            "Groq authentication failed. " +
            "Please check your API key."
        );

    }


    if (
        lower.includes(
            "rate limit"
        ) ||
        lower.includes(
            "429"
        )
    ) {

        return (
            "The Groq API rate limit was reached. " +
            "Please wait a moment and try again."
        );

    }


    return message;

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function initializeKeyboardShortcuts() {

    if (!questionBox) {
        return;
    }


    questionBox.addEventListener(
        "keydown",
        (event) => {

            /*
             CTRL + ENTER
             or
             CMD + ENTER
            */

            if (
                event.key === "Enter" &&
                (event.ctrlKey ||
                 event.metaKey)
            ) {

                event.preventDefault();

                askQuestion();

            }

        }
    );


    /* -----------------------------------------------------
       AUTO RESIZE TEXTAREA
    ----------------------------------------------------- */

    questionBox.addEventListener(
        "input",
        () => {

            questionBox.style.height =
                "auto";


            questionBox.style.height =
                Math.min(
                    questionBox.scrollHeight,
                    100
                ) + "px";

        }
    );

}


/* =========================================================
   GLOBAL ERROR HANDLING
========================================================= */

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "NUSHX Frontend Error:",
            event.error ||
            event.message
        );

    }
);


/* =========================================================
   INITIAL PIPELINE STATE
========================================================= */

resetPipeline();