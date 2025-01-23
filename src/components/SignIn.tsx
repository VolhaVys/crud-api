import React, {useState} from "react";
import {
    Typography,
    TextField,
    Container, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button
} from '@mui/material';
import {DateField, LocalizationProvider} from '@mui/x-date-pickers';
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {z} from "zod";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dayjs} from "dayjs";

const userSchema = z.object({
    userName: z.string().min(3, 'Username must not be lesser than 3 characters'),
    email: z.string().email('Invalid email'),
    date: z.date(),
    gender: z.enum(['female', 'male']).optional()
})

type User = z.infer<typeof userSchema>;

const SignIn: React.FC = () => {
    const [dateValue, setDateValue] = useState<Dayjs | null>(null);
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: {
            errors
        }
    } = useForm<User>({
        resolver: zodResolver(userSchema)
    })

    const onSubmit = (data: User) => {
        console.log("Form submitted with data:", data);
        navigate('/todo');
    };
    return (
        <Container maxWidth='xs' sx={{
            marginTop: '2rem',
        }}>
            <Typography align="center" variant="h6" component="h1">
                Sign In
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className='sign-in-form'>
                <FormControl>
                    {/*<FormLabel htmlFor="name">User name</FormLabel>*/}
                    <TextField
                        label="user name"
                        autoComplete="userName"
                        required
                        fullWidth
                        id="userName"
                        placeholder="Jon Snow"
                        color='primary'
                        {...register('userName')}
                        error={!!errors.userName}
                        helperText={'Username must not be lesser than 3 characters'}
                    />
                </FormControl>
                <FormControl>
                    {/*<FormLabel htmlFor="email">Email</FormLabel>*/}
                    <TextField
                        label="email"
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color='primary'
                        {...register("email")}
                        error={!!errors.email}
                        helperText={'Invalid email'}
                    />
                </FormControl>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Controller
                        name="date"
                        control={control}
                        render={({field}) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateField']}>
                                    <DateField
                                        {...field}
                                        value={dateValue}
                                        format="MM-DD-YYYY"
                                        onChange={(newValue) => {
                                            setDateValue(newValue);
                                            if (newValue) {
                                                setValue("date", newValue.toDate());
                                            }
                                        }}
                                        helperText={errors.date ? errors.date.message : ''}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        )}
                    />
                    <FormControl>
                        <FormLabel id="gender-buttons">gender</FormLabel>
                        <Controller
                            name="gender"
                            control={control}
                            defaultValue="female"
                            render={({field}) => (
                                <RadioGroup
                                    row
                                    aria-labelledby="gender-buttons"
                                    {...field}
                                    onChange={(event) => field.onChange(event.target.value)}
                                >
                                    <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                                    <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                </Box>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Sign in
                </Button>
            </form>
        </Container>
    )
}

export default SignIn;
