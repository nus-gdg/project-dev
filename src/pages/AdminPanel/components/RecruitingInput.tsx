import { useState } from "react";
import {
    Box,
    Button,
    Chip,
    TextField,
    Stack,
} from "@mui/material";

export default function RecruitingInput({ roles, setRoles }: {
    roles: string[]
    setRoles: React.Dispatch<React.SetStateAction<string[]>>
}) {
    const [role, setRole] = useState("");

    const handleAddRole = () => {
        const trimmed = role.trim();
        if (trimmed && !roles.includes(trimmed)) {
            setRoles([...roles, trimmed]);
            setRole("");
        }
    };

    const handleDeleteRole = (deletedRole: string) => {
        setRoles(roles.filter((r) => r !== deletedRole));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddRole();
        }
    };

    return (
        <Stack spacing={1}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onKeyPress={handleKeyPress} // press Enter to add
                    fullWidth
                    margin="dense"
                />
                <Button
                    variant="contained"
                    onClick={handleAddRole}
                    sx={{ py: 2 }}
                >
                    Add
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {roles.map((r) => (
                    <Chip
                        key={r}
                        label={r}
                        onDelete={() => handleDeleteRole(r)}
                        color="primary"
                    />
                ))}
            </Box>
        </Stack>
    );
}