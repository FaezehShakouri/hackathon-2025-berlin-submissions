import express from 'express';
import organizationRoutes from './routes/organization';
import contributorRoutes from './routes/contributor';
import sharesRoutes from './routes/shares';

const app = express();
app.use(express.json());

app.use('/organization', organizationRoutes);
app.use('/contributor', contributorRoutes);
app.use('/shares', sharesRoutes);

app.listen(3000, () => {
    console.log('Captable API server running on http://localhost:3000');
});