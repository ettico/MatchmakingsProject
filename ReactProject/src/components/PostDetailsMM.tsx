import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { userContext } from './UserContext';

// Define the validation schema using Yup
const schema = yup.object().shape({
  matchmakerName: yup.string().required('Name is required'),
  idNumber: yup.string().required('ID Number is required'),
  birthDate: yup.string().required('Birth Date is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Gender is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  mobilePhone: yup.string().required('Mobile Phone is required'),
  landlinePhone: yup.string(),
  phoneType: yup.string(),
  personalClub: yup.string(),
  community: yup.string(),
  occupation: yup.string(),
  previousWorkplaces: yup.string(),
  isSeminarGraduate: yup.boolean(),
  hasChildrenInShidduchim: yup.boolean(),
  experienceInShidduchim: yup.string(),
  lifeSkills: yup.string(),
  yearsInShidduchim: yup.number().positive().integer(),
  isInternalMatchmaker: yup.boolean(),
  printingNotes: yup.string(),
});

const MatchMakerForm = () => {
  const { user } = useContext(userContext); // Get the ID from context
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(`https://localhost:7012/api/MatchMaker/${user?.id}`, data);
      console.log('Data updated successfully', response.data);
    } catch (error) {
      console.error('Error updating data', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {Object.keys(schema.fields).map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <Controller
              name={field}
              control={control}
              defaultValue=""
              render={({ field: fieldProps }) => (
                <TextField
                  {...fieldProps}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  variant="outlined"
                  fullWidth
                  error={!!errors[field]}
                  helperText={errors[field] ? errors[field].message : ''}
                />
              )}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MatchMakerForm;
