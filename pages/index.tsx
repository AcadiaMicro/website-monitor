import type { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getTokenCookie } from "../utils/auth-cookies";
import { validateToken } from "../utils/session-utils";
import { formatedDate } from "../components/utils";

import useSWR from "swr";

import {
  Typography,
  Grid,
  Button,
  Box,
  Snackbar,
  Alert,
  LinearProgress,
  IconButton,
  Stack,
} from "@mui/material";

import StyledBar from "../components/StyledBar";

interface SnabackStateProps {
  status?: "success" | "error";
  message?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home = () => {
  const [snackbarActive, setSnackbarActive] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnabackStateProps>({});
  const [limit, setLimit] = useState(10);


  useEffect(() => {
    const limitQueryParam = new URLSearchParams(window.location.search).get("limit");

    if (limitQueryParam) {
      setLimit(Number(limitQueryParam))
    }
  }, [])

  const { data, mutate } = useSWR(`/api/runs?limit=${limit}&key=${process.env.API_ACCESS_KEY}`, fetcher);

  console.log(data);
  const runTest = async () => {
    const res = await fetch(`/api/runner?key=${process.env.API_ACCESS_KEY}`);
    const data = await res.json();

    setSnackbarActive(true);
    if (data.runId) {
      setSnackbarState({
        status: "success",
        message: "New run in progress. It may take 2-3 minutes to finish.",
      });
    } else {
      setSnackbarState({
        status: "error",
        message: data.error || "PROCESSING ERROR",
      });
    }
    mutate();
  };

  const handleSnackBarClose = () => {
    setSnackbarActive(false);
  };

  const removeRun = async (runId: string) => {
    const res = await fetch(`/api/delete/${runId}?key=${process.env.API_ACCESS_KEY}`, {
      method: "DELETE",
    });
    mutate();
  };

  const results = data?.data;

  if (!data || !results) {
    return <LinearProgress />;
  }

  return (
    <>
      <StyledBar />
      <Box sx={{ m: 4 }}>
        <Grid container sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4">Runs</Typography>
          </Grid>
          <Grid item>
            <Stack spacing={2} direction="row">
              <IconButton onClick={mutate}>
                <RefreshIcon />
              </IconButton>
              <Button variant="contained" onClick={runTest}>
                New Run
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Run Id</TableCell>
                    <TableCell>Run Status</TableCell>
                    <TableCell>Run Date</TableCell>
                    <TableCell>Duration (s)</TableCell>
                    <TableCell>Pages Checked</TableCell>
                    <TableCell>Failed Pages</TableCell>
                    <TableCell>AVG Page Time (s)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(results || []).map((row: any) => (
                    <TableRow
                      key={row.slug}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.run_id}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{formatedDate(row.timestamp, true)}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>{row.total_pages}</TableCell>
                      <TableCell>{row.failed_pages}</TableCell>
                      <TableCell>{row.avg_page_time}</TableCell>
                      <TableCell>
                        <Stack>
                          <Button
                            target="_blank"
                            rel="noopener noreferrer"
                            href={row.run_id}
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => removeRun(row.run_id as string)}
                          >
                            Delete Results
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Snackbar
              open={snackbarActive}
              autoHideDuration={6000}
              onClose={handleSnackBarClose}
            >
              <Alert
                onClose={handleSnackBarClose}
                severity={snackbarState.status}
                sx={{ width: "100%" }}
              >
                {snackbarState.message}
              </Alert>
            </Snackbar>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = getTokenCookie(context.req);
  if (!(await validateToken(token))) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return {
    props: {},
  };
};

export default Home;
