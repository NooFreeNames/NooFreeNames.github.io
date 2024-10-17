let Delta = Quill.import("delta");
let Link = Quill.import("formats/link");

Link.sanitize = (url) => url;

const bindings = {
    "block enter": {
        key: "Enter",
        collapsed: true,
        format: ["header1", "characters", "weapons", "artifact-sets"],
        suffix: /^$/,
        handler(range, context) {
            const [line, offset] = this.quill.getLine(range.index);
            const delta = new Delta()
                .retain(range.index)
                .insert("\n", context.format)
                .retain(line.length() - offset - 1)
                .retain(1, {
                    header1: null,
                    characters: null,
                    weapons: null,
                    "artifact-sets": null,
                });

            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
            this.quill.scrollIntoView();
        },
    },
    enter: {
        key: "Enter",
        shiftKey: true,
        handler: function (range, context) {
            this.quill.insertEmbed(range.index, "text", "↪");
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        },
    },
    "list-empty-enter": {
        key: "Enter",
        collapsed: true,
        format: ["plus-list", "minus-list"],
        empty: true,
        handler(range, context) {
            const formats = { list: false };
            if (context.format.indent) {
                formats.indent = false;
            }
            this.quill.formatLine(
                range.index,
                range.length,
                formats,
                Quill.sources.USER
            );
        },
    },
    "list-backspace": {
        key: "Backspace",
        collapsed: true,
        shiftKey: null,
        metaKey: null,
        ctrlKey: null,
        altKey: null,
        format: ["plus-list", "minus-list"],
        offset: 0,
        handler(range, context) {
            console.log(context.format);
            if (
                context.format["plus-list"] != null ||
                context.format["minus-list"] != null
            ) {
                this.quill.format("list", false, Quill.sources.USER);
            }
        },
    },
    shiftv: {
        key: "v",
        shiftKey: true,
        handler: function (range, context) {
            navigator.clipboard.readText().then(
                (text) => {
                    text = prepareLoadedHTML(text);
                    this.quill.insertEmbed(range.index, "text", text);
                    this.quill.setSelection(
                        range.index + text.length,
                        Quill.sources.SILENT
                    );
                },
                (err) => {
                    console.error(
                        "Не удалось загрузить данные из буфера: ",
                        err
                    );
                }
            );
            this.quill.insertEmbed(range.index, "text", "↪");
            this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        },
    },
};

var quill = new Quill("#content-editor", {
    modules: {
        toolbar: "#toolbar",
        keyboard: {
            bindings: bindings,
        },
        clipboard: {
            matchers: [
                [
                    "span",
                    (_, delta) => {
                        delta.ops.forEach(function (op) {
                            if (op.attributes && op.attributes) {
                                delete op.attributes;
                            }
                        });
                        return delta;
                    },
                ],
            ],
        },
    },
    theme: "snow",
    // formats: [
    //   "pyro",
    //   "dendro",
    //   "hydro",
    //   "cryo",
    //   "geo",
    //   "anemo",
    //   "electro",
    //   "header1",
    //   "cards",
    //   "header",
    //   "list",
    //   "clean",
    //   "link",
    // ],
});

const prepareSavedHTML = (html) => {
    return html
        .replaceAll("↪</p>", "</p>")
        .replaceAll("↪</h1>", "</h1>")
        .replaceAll("↪</li>", "</li>")
        .replaceAll("↪", "\n");
};
const prepareLoadedHTML = (html) => {
    return html
        .replaceAll(/(\r\n|\n|\r|<br>|<br\/>)/g, "↪")
        .replaceAll("↪</p>", "</p>")
        .replaceAll("↪</h1>", "</h1>")
        .replaceAll("↪</li>", "</li>");
};

quill.on("text-change", function () {
    const htmlContent = quill.root.innerHTML;
    localStorage.setItem("quillHtml", htmlContent);
});

window.addEventListener("load", function () {
    const savedHtml = localStorage.getItem("quillHtml");

    if (savedHtml) {
        quill.root.innerHTML = savedHtml;
    }
});

document.getElementById("save-button").addEventListener("click", function () {
    const htmlContent = prepareSavedHTML(quill.root.innerHTML);

    const blob = new Blob([htmlContent], { type: "text/html" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content.geoguide";
    link.click();
});

document.getElementById("copy-button").addEventListener("click", function () {
    const textContent = prepareSavedHTML(quill.root.innerHTML); // Получаем текстовое содержимое
    navigator.clipboard.writeText(textContent).catch((err) => {
        console.error("Ошибка при копировании в буфер обмена: ", err);
    });
});

document.getElementById("clean-button").addEventListener("click", function () {
    // Показываем окно подтверждения
    const confirmation = confirm("Вы уверены, что хотите очистить содержимое?");

    // Если пользователь подтвердил действие
    if (confirmation) {
        quill.root.innerHTML = "";
        localStorage.removeItem("quillHtml"); // Удаляем сохранённые данные
    }
});

document.getElementById("load-from-clipboard").addEventListener("click", () => {
    const confirmation = confirm(
        "Вы уверены, что хотите загрузить содержимое из буфера обмена? Это очистит текущее содержимое."
    );
    if (confirmation) {
        navigator.clipboard.readText().then(
            (text) => {
                text = prepareLoadedHTML(text);
                quill.root.innerHTML = text; // Загружаем содержимое из буфера обмена в редактор
                // localStorage.setItem("quillHtml", text); // Сохраняем содержимое в localStorage
            },
            (err) => {
                console.error("Не удалось загрузить данные из буфера: ", err);
            }
        );
    }
});

document
    .getElementById("load-from-file")
    .addEventListener("click", function () {
        const confirmation = confirm(
            "Вы уверены, что хотите загрузить содержимое из файла? Это очистит текущее содержимое."
        );
        if (confirmation) {
            document.getElementById("file-input").click();
        }
    });

document
    .getElementById("file-input")
    .addEventListener("change", function (event) {
        //TODO fix
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const text = prepareLoadedHTML(e.target.result);
                quill.root.innerHTML = text;
                localStorage.setItem("quillHtml", text);
                document.getElementById("file-input").value = "";
            };
            reader.readAsText(file);
        }
    });

window.onbeforeunload = function () {
    return true;
};

const editor = document.querySelector(".ql-editor");
function checkForEditorScroll() {
    if (editor.scrollHeight > editor.clientHeight) {
        editor.style.paddingRight = "7px";
    } else {
        editor.style.paddingRight = "0";
    }
}
const resizeEditorObserver = new ResizeObserver(() => {
    checkForEditorScroll();
});
resizeEditorObserver.observe(editor);
checkForEditorScroll();
