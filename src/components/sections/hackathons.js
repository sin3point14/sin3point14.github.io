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

const Hackathons = () => {

  const data = useStaticQuery(graphql`
    query {
      hackathons: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/hackathons/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              event
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
  const hackathons = data.hackathons.edges.filter(({ node }) => node);
  const firstSix = hackathons.slice(0, GRID_LIMIT);

  return (
    <section id="hackathons">
      <h2 className="numbered-heading" ref={revealTitle}>Hackathons</h2>


      <p className="inline-link archive-link">
        Apart from well planned development projects, I take part in fast paced hackathons to learn new stuff quickly.
      </p>
      <StyledTableContainer>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Event</th>
              <th className="hide-on-mobile">Result</th>
            </tr>
          </thead>
          <tbody>
            {hackathons.length > 0 &&
              hackathons.map(({ node }, i) => {
                const {
                  event,
                  result,
                  year,
                } = node.frontmatter;
                return (
                  <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                    <td className="overline year">{year}</td>

                    <td className="title">{event}</td>

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

export default Hackathons;
