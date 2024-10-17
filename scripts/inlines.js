const Inline = Quill.import("blots/inline");

class Base extends Inline {
    static tagName = "span";
    static formats() {
        return true;
    }
}

class Golden extends Base {
    static blotName = "golden";
    static className = "golden";
}
Quill.register(Golden);

class Gray extends Base {
    static blotName = "gray";
    static className = "gray";
}
Quill.register(Gray);

class Pyro extends Base {
    static blotName = "pyro";
    static className = "pyro";
}
Quill.register(Pyro);

class Dendro extends Base {
    static blotName = "dendro";
    static className = "dendro";
}
Quill.register(Dendro);

class Hydro extends Base {
    static blotName = "hydro";
    static className = "hydro";
}
Quill.register(Hydro);

class Cryo extends Base {
    static blotName = "cryo";
    static className = "cryo";
}
Quill.register(Cryo);

class Geo extends Base {
    static blotName = "geo";
    static className = "geo";
}
Quill.register(Geo);

class Anemo extends Base {
    static blotName = "anemo";
    static className = "anemo";
}
Quill.register(Anemo);

class Electro extends Base {
    static blotName = "electro";
    static className = "electro";
}
Quill.register(Electro);
