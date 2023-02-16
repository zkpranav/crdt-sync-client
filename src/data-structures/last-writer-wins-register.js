// TODO - extend w/ a Semaphore
class LastWriterWinsRegister {
    // Defines the only atomic value
    constructor(value) {
        this.value = value;
    }
    get value() {
        return this.value;
    }
    set value(newValue) {
        this.value = newValue;
    }
}
export { LastWriterWinsRegister };
