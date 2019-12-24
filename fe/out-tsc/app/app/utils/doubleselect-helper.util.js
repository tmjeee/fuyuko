export const doubleSelectToObjectMap = (attribute) => {
    return attribute.pair2.reduce((o, p) => {
        if (!o[p.key1]) {
            o[p.key1] = [];
        }
        o[p.key1].push({ key: p.key2, value: p.value });
        return o;
    }, {});
};
//# sourceMappingURL=doubleselect-helper.util.js.map