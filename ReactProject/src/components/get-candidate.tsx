import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { Male, Women } from '../Models';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const GetCandidates1 = () => {
    const [Males, setMales] = useState<Male[]>([]);
    const [Womens, setWomens] = useState<Women[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUsersMales = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Male[]>('https://localhost:7012/api/Male');
            setMales(response.data);
        } catch (error) {
            console.error("Error fetching males:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersWomens = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Women[]>('https://localhost:7012/api/Women');
            setWomens(response.data);
        } catch (error) {
            console.error("Error fetching women:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersMales();
        fetchUsersWomens();
    }, []);

    // const handleNavigate = (role:string, id:number) => {
    //     navigate(`details/${role}/${id}`); // לדוגמה, נניח שהנתיב הוא '/details/:role/:id'
    // };

    return (
        <div style={{ padding: '20px' }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {[...Males, ...Womens].map((user) => (
                        <Grid item xs={12} md={6} key={user.id}>
                            <Card sx={{ margin: 2, backgroundColor: blue[50] }}>
                                <CardContent>
                                    <Typography variant="h4" gutterBottom>{user.firstName} {user.lastName}</Typography>
                                    <Button variant="contained" onClick={() => { navigate(`details/${user.role}/${user.id}` )}}> לכל הפרטים</Button>
                                    {/* <Button variant="contained" onClick={() => handleNavigate('family', user.id)}>פרטי משפחה</Button>
                                    <Button variant="contained" onClick={() => handleNavigate('contact', user.id)}>התקשרות ובירורים</Button> */}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default GetCandidates1;
