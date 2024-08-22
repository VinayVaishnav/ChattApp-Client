import React from 'react'
import {styled} from "@mui/material"
import {Link as LinkCompo} from "react-router-dom"

export const VisuallyHidden =styled("input")({
    border:0,
    clip:"react(0 0 0 0)",
    height:1,
    margin:-1,
    overflow:'hidden',
    padding:0,
    position:'absolute',
    whiteSpace:'nowrap',
    width:1,
});

export const Link=styled(LinkCompo)`
    text-decoration:none;
    color:black;
    padding: 1rem;
    &:hover{
        background-color: rgba(0,0,0,0.1);
    }
`;

export const InputBox= styled("input")`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 3rem;
    border-radius:1.5rem;
    background-color: "gray";
`;

export const SearchField=styled("input")`
    padding: 1rem 2rem;
    border: none;
    outline: none;
    border-radius: 1.5rem;
    background-color: #f1f1f1;
    font-size: 1.1rem;
    width: 20vmax;
`;

export const CurveButton=styled("button")`
    border-radius: 1.5rem;
    padding: 1rem 2rem;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: 1.1rem;
    &:hover{
        background-color: rgba(0,0,0,0.8);
    }
`