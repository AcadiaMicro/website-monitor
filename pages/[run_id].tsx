import type { NextPage } from "next";
import { readFile, writeFile } from "fs/promises";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import firestore from "../connector/firestore";
import { Typography, Grid, Divider, Box } from "@mui/material";

import StyledBar from "../components/StyledBar";

import { format } from "date-fns";

interface HomePageProps {
  results: any;
}

const Home = ({ results }: HomePageProps) => {
  return (
    <>
      <StyledBar />
      <Box sx={{ m: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4">Run Stats</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Grid container>
          <Grid item xs={4}>
            <Typography variant="h6">Run Status</Typography>
            <Typography>{results.status}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Run Duration (s)</Typography>
            <Typography>{results.duration}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Completed At</Typography>
            <Typography>
              {format(new Date(results.timestamp), "MM-dd-yy HH:mm OOOO")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant="h6">Total Pages</Typography>
            <Typography>{results.total_pages}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Resolved Pages</Typography>
            <Typography>{results.success_pages}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Failed Pages</Typography>
            <Typography>{results.failed_pages}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ my: 8 }} />
        {results.failed_pages > 0 && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h4">Failure Results</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Landing Page Slug</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Dato CMS Status</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell>HTTP Status</TableCell>
                        <TableCell>Verify Element</TableCell>
                        <TableCell>Meta Verified</TableCell>
                        <TableCell>Load time (s)</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.res
                        .filter((item: any) => item.status >= 400)
                        .map((row: any) => (
                          <TableRow
                            key={row.slug}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              background: row.status >= 400 ? "#ff8941" : "",
                            }}
                          >
                            <TableCell>{row.slug}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row._status}</TableCell>
                            <TableCell>
                              {format(
                                new Date(row.createdAt),
                                "MM-dd-yy HH:mm OOOO"
                              )}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(row.updatedAt),
                                "MM-dd-yy HH:mm OOOO"
                              )}
                            </TableCell>
                            <TableCell>
                              {row.status} / {row.status == 200 && "OK"}{" "}
                              {row.status == 404 && "Not Found"}
                            </TableCell>
                            <TableCell>
                              {row.check_element_exists ? "Present" : "Missing"}
                            </TableCell>
                            <TableCell>
                              {row.meta_info_verified > 0 ? "Ok" : "Fail"}
                            </TableCell>
                            <TableCell>{row.page_time || "N/A"}</TableCell>

                            <TableCell>
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={row.url}
                              >
                                View
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Box sx={{ my: 8 }} />
          </>
        )}

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4">All Results</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Landing Page Slug</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Dato CMS Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>HTTP Status</TableCell>
                    <TableCell>Verify Element</TableCell>
                    <TableCell>Meta Verified</TableCell>
                    <TableCell>Load time (s)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.res.map((row: any) => (
                    <TableRow
                      key={row.slug}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{row.slug}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row._status}</TableCell>
                      <TableCell>
                        {format(new Date(row.createdAt), "MM-dd-yy HH:mm OOOO")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(row.updatedAt), "MM-dd-yy HH:mm OOOO")}
                      </TableCell>
                      <TableCell>
                        {row.status} / {row.status == 200 && "OK"}{" "}
                        {row.status == 404 && "Not Found"}
                      </TableCell>
                      <TableCell>
                        {row.check_element_exists ? "Present" : "Missing"}
                      </TableCell>
                      <TableCell>
                        {row.meta_info_verified > 0 ? "Ok" : "Fail"}
                      </TableCell>
                      <TableCell>{row.page_time || "N/A"}</TableCell>

                      <TableCell>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={row.url}
                        >
                          View
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const res = await firestore.getRun(context.params.run_id);

  return {
    props: {
      results: res,
    },
  };
}

export default Home;
