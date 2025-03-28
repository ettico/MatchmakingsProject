import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Card, CardContent, Typography, Grid } from '@mui/material';
import { Male, Women } from '../Models';
import { blue } from '@mui/material/colors';

const GetMales = () => {
    const [Males, setMales] = useState<Male[]>([]);
    const [Womens, setWomens] = useState<Women[]>([]);

    const [loading, setLoading] = useState(false);

    const fetchUsersMales = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Male[]>('https://localhost:7012/api/Male'); // עדכן את ה-URL אם צריך
            setMales(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersMales();
    }, []);
    const fetchUsersWomens = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Women[]>('https://localhost:7012/api/Women'); // עדכן את ה-URL אם צריך
            setWomens(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersWomens();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {Males.length > 0 ? (
                        Males.map((user) => (
                            <Grid  key={user.id}>
                                <Card sx={{ margin: 2, backgroundColor: blue[50] }}>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom>{user.firstName} {user.lastName}</Typography>
                                        <Typography variant="h5">פרטים אישיים</Typography>
                                        <Typography variant="body1">מס זהות: {user.tz}</Typography>
                                        <Typography variant="body1">תאריך לידה: {user.burnDate}</Typography>
                                        <Typography variant="body1">כתובת: {user.address}</Typography>
                                        <Typography variant="body1">גיל: {user.age}</Typography>
                                        <Typography variant="body1">עיר: {user.city}</Typography>
                                        <Typography variant="body1">מדינה: {user.country}</Typography>
                                        <Typography variant="body1">חוג: {user.class}</Typography>
                                        {user.anOutsider&& <Typography variant="body1"> {user.anOutsider}</Typography>}
                                        <Typography variant="body1">רקע: {user.backGround}</Typography>
                                        <Typography variant="body1">פתיחות: {user.openness}</Typography>

                                        <Typography variant="h5">פרטים נוספים</Typography>
                                        <Typography variant="body1">מצב בריאותי: {user.healthCondition ? 'כן' : 'לא'}</Typography>
                                        <Typography variant="body1">סטטוס: {user.status}</Typography>

                                       {user.driversLicense&&<Typography variant="body1"> רשיון נהיגה</Typography>}
                                       {user.smoker&&<Typography variant="body1">מעשן</Typography>}
                                        <Typography variant="body1">זקן: {user.beard}</Typography>
                                        <Typography variant="body1">כובע: {user.hot}</Typography>
                                        <Typography variant="body1">חליפה: {user.suit}</Typography>

                                        <Typography variant="h5">רקע ישיבתי</Typography>
                                        <Typography variant="body1">ישיבה קטנה: {user.smallYeshiva}</Typography>
                                        <Typography variant="body1">ישיבה גדולה: {user.bigYeshiva}</Typography>
                                        <Typography variant="body1">קיבוץ: {user.kibbutz}</Typography>
                                        <Typography variant="body1">עיסוק: {user.occupation}</Typography>

                                        <Typography variant="h5">מראה חיצוני</Typography>
                                        <Typography variant="body1">גובה: {user.height} ס"מ</Typography>
                                        <Typography variant="body1">מראה כללי: {user.generalAppearance}</Typography>
                                        <Typography variant="body1">צבע פנים: {user.facePaint}</Typography>
                                        <Typography variant="body1">מראה: {user.appearance}</Typography>

                                        {/* <Typography variant="body1">טלפון: {user.phone}</Typography>
                                        <Typography variant="body1">מייל: {user.username}</Typography>
                                        <Typography variant="body1">טלפון אב: {user.fatherPhone}</Typography>
                                        <Typography variant="body1">טלפון אם: {user.motherPhone}</Typography>
                                        <Typography variant="body1">סטטוס פנוי: {user.statusVacant ? 'כן' : 'לא'}</Typography> */}
                                        {/* <Typography variant="body1">סוג זוגיות: {user.pairingType}</Typography> */}
                                        <Typography variant="h5">ציפיות מבת הזוג </Typography>

                                        <Typography variant="body1">ציפיות מהשותף: {user.expectationsFromPartner}</Typography>
                                        <Typography variant="body1">חוג: {user.club}</Typography>
                                        <Typography variant="body1">גיל מינימלי: {user.ageFrom}</Typography>
                                        <Typography variant="body1">גיל מקסימלי: {user.ageTo}</Typography>
                                        <Typography variant="body1">תכונות חשובות בי: {user.importantTraitsInMe}</Typography>
                                        <Typography variant="body1">תכונות חשובות שאני מחפש: {user.importantTraitsIAmLookingFor}</Typography>
                                        <Typography variant="body1">סגנון סמינר מועדף: {user.preferredSeminarStyle}</Typography>
                                        <Typography variant="body1">מסלול מקצועי מועדף: {user.preferredProfessionalPath}</Typography>
                                        <Typography variant="body1">כיסוי ראש: {user.headCovering}</Typography>
                                      
                                        {/* <Typography variant="body1">כיסוי ראש: {user.HeadCovering}</Typography> */}

                                        {/* הוסף כאן שדות נוספים לפי הצורך */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" textAlign="center">אין משתמשים זמינים.</Typography>
                    )}


                    {Womens.length > 0 ? (
                        Womens.map((user) => (
                            <Grid  key={user.id}>
                                <Card sx={{ margin: 2, backgroundColor: blue[50] }}>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom>{user.firstName} {user.lastName}</Typography>
                                        <Typography variant="h5">פרטים אישיים</Typography>
                                        <Typography variant="body1">מס זהות: {user.tz}</Typography>
                                        <Typography variant="body1">תאריך לידה: {user.burnDate}</Typography>
                                        <Typography variant="body1">כתובת: {user.address}</Typography>
                                        <Typography variant="body1">גיל: {user.age}</Typography>
                                        <Typography variant="body1">עיר: {user.city}</Typography>
                                        <Typography variant="body1">מדינה: {user.country}</Typography>
                                        <Typography variant="body1">חוג: {user.class}</Typography>
                                        {user.anOutsider&& <Typography variant="body1"> {user.anOutsider}</Typography>}
                                        <Typography variant="body1">רקע: {user.backGround}</Typography>
                                        <Typography variant="body1">פתיחות: {user.openness}</Typography>

                                        <Typography variant="h5">פרטים נוספים</Typography>
                                        <Typography variant="body1">מצב בריאותי: {user.healthCondition ? 'כן' : 'לא'}</Typography>
                                        <Typography variant="body1">סטטוס: {user.status}</Typography>
                                        <Typography variant="body1">כיסוי ראש: {user.headCovering}</Typography>

                                        <Typography variant="h5">רקע השכלתי </Typography>
                                        <Typography variant="body1">תיכון: {user.highSchool}</Typography>
                                        <Typography variant="body1">סמינר: {user.seminar}</Typography>
                                        <Typography variant="body1">מסלול לימודי :{user.studyPath}</Typography>
                                        <Typography variant="body1">מוסד לימודי נוסף: {user.additionalEducationalInstitution}</Typography>
                                        <Typography variant="body1">עיסוק כיום: {user.currentOccupation}</Typography>

                                      
                                        <Typography variant="h5">מראה חיצוני</Typography>
                                        <Typography variant="body1">גובה: {user.height} ס"מ</Typography>
                                        <Typography variant="body1">מראה כללי: {user.generalAppearance}</Typography>
                                        <Typography variant="body1">צבע פנים: {user.facePaint}</Typography>
                                        <Typography variant="body1">מראה: {user.appearance}</Typography>

                                        {/* <Typography variant="body1">טלפון: {user.phone}</Typography>
                                        <Typography variant="body1">מייל: {user.username}</Typography>
                                        <Typography variant="body1">טלפון אב: {user.fatherPhone}</Typography>
                                        <Typography variant="body1">טלפון אם: {user.motherPhone}</Typography>
                                        <Typography variant="body1">סטטוס פנוי: {user.statusVacant ? 'כן' : 'לא'}</Typography> */}
                                        {/* <Typography variant="body1">סוג זוגיות: {user.pairingType}</Typography> */}
                                        <Typography variant="h5">ציפיות מבן הזוג </Typography>

                                        <Typography variant="body1">חוג: {user.club}</Typography>
                                        <Typography variant="body1">גיל מינימלי: {user.ageFrom}</Typography>
                                        <Typography variant="body1">גיל מקסימלי: {user.ageTo}</Typography>
                                        <Typography variant="body1">תכונות חשובות בי: {user.importantTraitsInMe}</Typography>
                                        <Typography variant="body1">תכונות חשובות שאני מחפש: {user.importantTraitsIMLookingFor}</Typography>
                                        <Typography variant="body1"> סגנון הישיבות המועדף: {user.preferredSittingStyle}</Typography>
                                        <Typography variant="h6">  מעונינת שהבחור יהיה </Typography>

                                        {user.drivingLicense&&<Typography variant="body1"> רשיון נהיגה</Typography>}
                                        {user.smoker&&<Typography variant="body1">לא מעשן</Typography>}
                                        <Typography variant="body1">זקן: {user.beard}</Typography>
                                        <Typography variant="body1">כובע: {user.hat}</Typography>
                                        <Typography variant="body1">חליפה: {user.suit}</Typography>
                                        <Typography variant="body1">עיסוק: {user.occupation}</Typography>

                                        

                                        {/* הוסף כאן שדות נוספים לפי הצורך */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" textAlign="center">אין משתמשים זמינים.</Typography>
                    )}
                </Grid>
            )}
        </div>
    );
};

export default GetMales;
