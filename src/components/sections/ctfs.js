import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 20px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }
  }
`;

const Ctfs = () => {

  const data = useStaticQuery(graphql`
    query {
      ctfs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/ctfs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              event
              team
              result
              year
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const ctfs = data.ctfs.edges.filter(({ node }) => node);
  const firstSix = ctfs.slice(0, GRID_LIMIT);

  return (
    <section id="ctfs">
      <h2 className="numbered-heading" ref={revealTitle}>CTF Profile</h2>


      <p className="inline-link archive-link">
        I play CTFs regularly with teams <a href='https://ctftime.org/team/2480/'>SDSLabs</a> and <a href='https://ctftime.org/team/16691/'>InfosecIITR</a>, solving reverse engineering, pwning and web expolitation challenges.
      </p>
      <StyledTableContainer>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Event</th>
              <th className="hide-on-mobile">Team</th>
              <th className="hide-on-mobile">Result</th>
            </tr>
          </thead>
          <tbody>
            {ctfs.length > 0 &&
              ctfs.map(({ node }, i) => {
                const {
                  event,
                  result,
                  year,
                  team
                } = node.frontmatter;
                return (
                  <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                    <td className="overline year">{year}</td>

                    <td className="title">{event}</td>

                    <td className="company hide-on-mobile">
                      {team}
                    </td>

                    <td className="company hide-on-mobile">
                      {result}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </StyledTableContainer>
    </section>

  );
};

export default Ctfs;
