const List = Quill.import("formats/list");

class PlusList extends List {
    static blotName = "plus-list";
    static className = "plus-list";
}

Quill.register(PlusList);

class MinusList extends List {
    static blotName = "minus-list";
    static className = "minus-list";
}

Quill.register(MinusList);
