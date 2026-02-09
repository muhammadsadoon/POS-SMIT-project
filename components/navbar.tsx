"use client";
import React, { useRef } from 'react'
import styled from 'styled-components';

interface Props {
    children: React.ReactNode;
    className: String
}
const Navbar: React.FC<Props> = ({ children ,className}) => {
    window.onscroll = function () { scrollFunction() };
    const containerEl = useRef<HTMLDivElement | null>(null);
    function scrollFunction() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            if (containerEl.current) {
                containerEl.current.style.top = "0";
                containerEl.current.style.transition = "all ease 0.4s";
                containerEl.current.style.boxShadow = "2px 2px 30px black";
            }
        } else {
            if (containerEl.current) {
                containerEl.current.style.top = "-200vh";
                containerEl.current.style.position = "fixed";
            }
        }
    }
    return (
        <div ref={containerEl} className={`${className}`}>
            {
                children
            }
        </div>
    )
}

export default Navbar;
