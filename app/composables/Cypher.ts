export const useCypher = () => {
    const isCypher = ref(false);

    const { c_y_p_h_e_r } = useMagicKeys();

    watchEffect(() => {
        if (c_y_p_h_e_r?.value) {
            isCypher.value = !isCypher.value;
        }
    });

    return isCypher;
};
