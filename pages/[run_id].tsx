import type { NextPage } from "next";
import { readFile, writeFile } from "fs/promises";

import { useState, FC } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";

import firestore from "../connector/firestore";
import { Typography, Grid, Divider, Box } from "@mui/material";

import StyledBar from "../components/StyledBar";

import { formatedDate } from "../components/utils";

interface HomePageProps {
  results: any;
}

const RenderResultsTable = ({
  results,
  runner = "landingPageRunnerHeadless",
}: {
  results: any;
  runner: string;
}) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("slug");

  const descendingComparator = (a: any, b: any) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const sortedData = (a: any, b: any) => {
    return order === "desc"
      ? descendingComparator(a, b)
      : -descendingComparator(a, b);
  };

  const createSortHandler = (sortKey: string) => {
    const isAsc = orderBy === sortKey && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(sortKey);
  };

  const SortableCell = (props: { sortKey: string; children: FC | string }) => {
    const { sortKey, children } = props;
    return (
      <TableCell>
        <TableSortLabel
          active={orderBy === sortKey}
          direction={orderBy === sortKey ? order : "asc"}
          onClick={(event) => createSortHandler(sortKey)}
        >
          {children}
          {orderBy === sortKey ? (
            <Box component="span" sx={visuallyHidden}>
              {order === "desc" ? "sorted descending" : "sorted ascending"}
            </Box>
          ) : null}
        </TableSortLabel>
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <SortableCell sortKey="slug">Landing Page Slug</SortableCell>
            <SortableCell sortKey="name">Name</SortableCell>
            <SortableCell sortKey="_status">Dato CMS Status</SortableCell>
            <TableCell>Page Create Date</TableCell>
            <TableCell>Page Update Date</TableCell>
            <TableCell>HTTP Status</TableCell>
            <TableCell>Verify Element</TableCell>
            <TableCell>Load time (s)</TableCell>
            {runner == "landingPageRunnerHeadless" && (
              <TableCell>Screenshoot</TableCell>
            )}

            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.sort(sortedData).map((row: any) => (
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
              <TableCell>{formatedDate(row.createdAt)}</TableCell>
              <TableCell>{formatedDate(row.updatedAt)}</TableCell>
              <TableCell>
                {row.status} / {row.status == 200 && "OK"}{" "}
                {row.status == 404 && "Not Found"}
              </TableCell>
              <TableCell>
                {row.check_element_exists ? "Present" : "Missing"}
              </TableCell>
              <TableCell>{row.page_time || "N/A"}</TableCell>
              {runner == "landingPageRunnerHeadless" && (
              <TableCell>
                {row.screenshot_url ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={row.screenshot_url.auth_url}
                  >
                    <img height="60" src={row.screenshot_url.auth_url} />
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
              )}
              <TableCell>
                <a target="_blank" rel="noopener noreferrer" href={row.url}>
                  View Page
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

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
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography>
              <b>Run Status:</b> {results.status}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>
              <b>Run Duration (s):</b> {results.duration}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>
              <b>Completed (All times are EST):</b>{" "}
              {formatedDate(results.timestamp, true)}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Total Pages:</b> {results.total_pages}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>
              <b>Resolved Pages:</b> {results.success_pages}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>
              <b>Failed Pages: </b> {results.failed_pages}
            </Typography>
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
                <RenderResultsTable
                  runner={results.runner}
                  results={results.res.filter(
                    (item: any) => item.status >= 400
                  )}
                />
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
            <RenderResultsTable runner={results.runner} results={results.res} />
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
