export const modelConfirmClose = {
    methods:{
        handleClose(done) {
            this.$confirm(this.$t('common.confirmClose'))
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
    }
}