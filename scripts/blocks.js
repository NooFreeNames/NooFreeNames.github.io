const Block = Quill.import("blots/block");

class CustomHeader extends Block {
    static blotName = "head";
    static tagName = "h1";
    static className = "head";
}
Quill.register(CustomHeader);

class Characters extends Block {
    static formats() {
        return true;
    }
    static blotName = "characters";
    static tagName = "div";
    static className = "characters";
}
Quill.register(Characters);

class Weapons extends Block {
    static blotName = "weapons";
    static tagName = "div";
    static className = "weapons";
}
Quill.register(Weapons);

class ArtifactSets extends Block {
    static blotName = "artifact-sets";
    static tagName = "div";
    static className = "artifact-sets";
}
Quill.register(ArtifactSets);
