import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';






function ModelUI({ IsModalOpened, width, children }) {
    return (
        <>
            <Modal
                open={IsModalOpened}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">

                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: Number(width),
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    {children}
                </Box>
            </Modal>
        </>
    );
}

export default ModelUI;