%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%	Document Class for INSO master thesis
%
%	Author: Stefan Taber
%	Date: 2011/07/15
%	Last Modification: 2011/08/04
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Information about the class
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\def\fileversion{Version 1.1}
\def\filedate{2011/07/14}
\def\filedescription{INSO thesis Document Class}
\def\fileauthor{Stefan Taber}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Create Class.
% INSOexpose extends scrartcl
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{INSOthesis}[\filedate\space \filedescription\space \fileversion\space by \fileauthor]
\typeout{\filedate\space \filedescription\space \fileversion\space by \fileauthor}
\LoadClassWithOptions{memoir}

\makeatletter

\RequirePackage{xkeyval}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% OPTIONS params
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% titlepages
\newif\ifthesis@defaulttitlepages	\thesis@defaulttitlepagestrue
\newif\ifthesis@tutitlepageDE		\thesis@tutitlepageDEtrue
\newif\ifthesis@tutitlepageEN		\thesis@tutitlepageENfalse
\newif\ifthesis@insotitlepageDE		\thesis@insotitlepageDEfalse
\newif\ifthesis@insotitlepageEN		\thesis@insotitlepageENfalse
% language
\newif\ifthesis@english				\thesis@englishfalse
% bachelor
\newif\ifthesis@masterthesis		\thesis@masterthesistrue
% abstract
\newif\ifthesis@declaration		\thesis@declarationtrue
\newif\ifthesis@acknowledgements	\thesis@acknowledgementstrue
\newif\ifthesis@listoffigures		\thesis@listoffigurestrue
\newif\ifthesis@listoftables		\thesis@listoftablestrue
\newif\ifthesis@listoflistings		\thesis@listoflistingsfalse
\newif\ifthesis@listofalgorithms	\thesis@listofalgorithmsfalse
\newif\ifthesis@listofabbrev		\thesis@listofabbrevtrue
\newif\ifthesis@todonotes		\thesis@todonotesfalse
% commons
\newif\ifAssistance			\Assistancetrue
\newif\ifthesis@webreferences		\thesis@webreferencestrue
% abbreviations
\newif\ifglossary			\glossaryfalse
\newif\ifacronym			\acronymtrue
\newif\ifglossaries			\glossariestrue
% index
\newif\ifthesis@indextop	\thesis@indextopfalse
\newif\ifthesis@toc			\thesis@toctrue

\newif\ifthesis@doublepage		\thesis@doublepagefalse

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% OPTIONS
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% abbreviations
\DeclareOption{acronym}		{\acronymtrue}
\DeclareOption{noacronym}	{\acronymfalse}
\DeclareOption{glossary}	{\glossarytrue}
\DeclareOption{noglossary}	{\glossaryfalse}
% bachelor
\DeclareOption{bachelor}{
  \thesis@masterthesisfalse
  \thesis@acknowledgementsfalse
  \thesis@declarationfalse
}
% commons
\DeclareOption{noassistance}	{\Assistancefalse}
\DeclareOption{webreferences}	{\thesis@webreferencestrue}
\DeclareOption{nowebreferences}	{\thesis@webreferencesfalse}
% todo
\DeclareOption{disabletodo}	{\thesis@todonotesfalse}
\DeclareOption{todo}		{\thesis@todonotestrue}
% abstracts
\DeclareOption{declaration}	{\thesis@declarationtrue}
\DeclareOption{acknowledgements}{\thesis@acknowledgementstrue}
\DeclareOption{listoffigures}	{\thesis@listoffigurestrue}
\DeclareOption{listoftables}	{\thesis@listoftablestrue}
\DeclareOption{listoflistings}	{\thesis@listoflistingstrue}
\DeclareOption{listofalgorithms}{\thesis@listofalgorithmstrue}
\DeclareOption{listofabbrev}	{\thesis@listofabbrevtrue}

\DeclareOption{nodeclaration}		{\thesis@declarationfalse}
\DeclareOption{noacknowledgements}	{\thesis@acknowledgementsfalse}
\DeclareOption{nolistoffigures}		{\thesis@listoffiguresfalse}
\DeclareOption{nolistoftables}		{\thesis@listoftablesfalse}
\DeclareOption{nolistoflistings}	{\thesis@listoflistingsfalse}
\DeclareOption{nolistofalgorithms}	{\thesis@listofalgorithmsfalse}
\DeclareOption{nolistofabbrev}		{\thesis@listofabbrevfalse}
% language support
\DeclareOption{english} {\thesis@englishtrue}
\DeclareOption{german} 	{\thesis@englishfalse}
\DeclareOption{ngerman} {\thesis@englishfalse}
\DeclareOption{deutsch} {\thesis@englishfalse}
% titlepages
\DeclareOption{tutitlepageEN}		{\thesis@tutitlepageENtrue		\thesis@defaulttitlepagesfalse}
\DeclareOption{insotitlepageEN}		{\thesis@insotitlepageENtrue	\thesis@defaulttitlepagesfalse}
\DeclareOption{tutitlepageDE}		{\thesis@tutitlepageDEtrue		\thesis@defaulttitlepagesfalse}
\DeclareOption{insotitlepageDE}		{\thesis@insotitlepageDEtrue	\thesis@defaulttitlepagesfalse}
\DeclareOption{notutitlepageEN}		{\thesis@tutitlepageENfalse		\thesis@defaulttitlepagesfalse}
\DeclareOption{noinsotitlepageEN}	{\thesis@insotitlepageENfalse	\thesis@defaulttitlepagesfalse}
\DeclareOption{notutitlepageDE}		{\thesis@tutitlepageDEfalse		\thesis@defaulttitlepagesfalse}
\DeclareOption{noinsotitlepageDE}	{\thesis@insotitlepageDEfalse	\thesis@defaulttitlepagesfalse}
% index
\DeclareOption{indexbottom}			{\thesis@indextopfalse}
\DeclareOption{indextop}			{\thesis@indextoptrue}
\DeclareOption{indextoc}			{\thesis@toctrue}
\DeclareOption{noindextoc}			{\thesis@tocfalse}
% layout
\DeclareOption{twoside}				{\thesis@doublepagetrue \PassOptionsToClass{\CurrentOption}{memoir}}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{memoir}}
% default options
\ExecuteOptions{a4paper, 10pt, ngerman}
\ProcessOptions\relax
\ProcessOptionsX\relax

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% USE Packages
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\ifthesis@indextop
	\thesis@tocfalse
\fi

% standard packages
\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage[bf, hang]{caption}
\RequirePackage[german,ngerman,english]{babel}
\RequirePackage{csquotes}
\RequirePackage{geometry}[2010/09/12]
\RequirePackage{url}
\RequirePackage[table]{xcolor}
\RequirePackage{varioref}
\RequirePackage[pdfusetitle]{hyperref}					% links in pdf
\RequirePackage[all]{hypcap}
\RequirePackage{graphicx}
\RequirePackage{tabularx}
\RequirePackage{longtable}
\RequirePackage{multirow}
\RequirePackage{float}

% programming packages
\RequirePackage{calc}
\RequirePackage{ifthen}
\RequirePackage{etoolbox}
\RequirePackage{ifpdf}
\let\footruleskip\relax % for compatibility of memoir and fancyhdr
\RequirePackage[breakall]{truncate}

% important packages
\RequirePackage{styles/INSO}
\RequirePackage{styles/TUINFDA}
\RequirePackage[backend=bibtex,style=numeric-comp]{biblatex}
\RequirePackage[lined,linesnumbered,algochapter]{algorithm2e} % Algorithm-Environment
\RequirePackage{listings}
\RequirePackage[hang,bottom,norule]{footmisc}
% glossaries
% \RequirePackage{glossaries}
% \ifacronym
% 	\PassOptionsToPackage{acronym, shortcuts}{glossaries}
% 	\glossariestrue
% \else
% 	\ifglossary
% 		\glossariestrue
% 	\else
% 		\glossariesfalse
% 		\renewcommand{\glsdoifexists}[2]{%
% 			\ifglsentryexists{#1}{#2}{#1}%
% 		}
% 	\fi
% \fi
% \ifthesis@toc
% 	\PassOptionsToPackage{toc}{glossaries}
% \fi

\ifacronym
	\ifthesis@toc
	  \RequirePackage[acronym, toc, shortcuts, nonumberlist]{glossaries}
	\else
	  \RequirePackage[acronym, shortcuts, nonumberlist]{glossaries}
	\fi
  \glossariestrue
	\renewcommand*{\glspostdescription}{}
\else
	\ifthesis@toc
	  \RequirePackage[toc, shortcuts, nonumberlist]{glossaries}
	\else
	  \RequirePackage[shortcuts, nonumberlist]{glossaries}
	\fi
  \ifglossary
    \glossariestrue
  \else
    \glossariesfalse
  \fi
	\renewcommand*{\glspostdescription}{}
\fi
%
\ifthesis@todonotes
  \RequirePackage{todonotes}
\else
  \RequirePackage[obeyDraft]{todonotes}
\fi
\RequirePackage{fancyhdr}
\RequirePackage{tikz}
\usetikzlibrary{arrows,automata}
%\RequirePackage[standard]{ntheorem}

% necessary packages
\RequirePackage{lastpage}
\RequirePackage{pgf}
\DisemulatePackage{setspace}
\RequirePackage{setspace}
\RequirePackage{titlesec}
%\RequirePackage{sectsty}

% optional packages
\RequirePackage{fix-cm}
\RequirePackage{verbatim}            			% Code-Environment
\RequirePackage{needspace}
\RequirePackage{ifdraft}

% test packages
%\RequirePackage{morewrites}
%\RequirePackage {splitidx}
% \RequirePackage{comment} % wurde entfernt, weil keine streams mehr vorhanden waren. Latex unterstüzt nur 16 offene Write-Streams.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Package Version checking
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\@ifpackagelater{geometry}{2010/09/12}{}{
  \PackageError{INSOthesis}{Outdated 'geometry' package}{
    Upgrade to geometry v5.6 (2010/09/12) or later.\MessageBreak
    I found: '\csuse{ver@geometry.sty}'.\MessageBreak
    This is a fatal error. I'm aborting now.
  }
  %\endinput
}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Expose informations
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\gdef\@title		{Titel der Arbeit}
\gdef\@shorttitle	{\@title}
\gdef\@subtitle		{}
%\gdef\@author		{Vorname Nachname}
\gdef\@date		{Datum}

%\gdef\title#1		{\xdef\@title		{#1}}
\gdef\shorttitle#1	{\gdef\@shorttitle	{#1}}
\gdef\subtitle#1	{\gdef\@subtitle	{#1}}
%\gdef\author#1		{\xdef\@author		{#1}}
%\gdef\date#1		{\gdef\@date		{#1}}

\gdef\@thesistitle		{\@title}
\gdef\@thesisshorttitle		{\@shorttitle}
\gdef\@thesissubtitle		{\@subtitle}
\gdef\@thesisdate		{\@date}
\ifthesis@masterthesis
  \gdef\@thesistype		{DIPLOMARBEIT}
  \gdef\@thesistypeen		{MASTER'S THESIS}
\else
  \gdef\@thesistype		{BACHELORARBEIT}
  \gdef\@thesistypeen		{BACHELOR THESIS}
\fi
\ifthesis@masterthesis
  \gdef\@thesisdegree		{Diplom-Ingenieur/in}
  \gdef\@thesisdegreeen		{Master of Science}
\else
  \gdef\@thesisdegree		{Bachelor of Science}
  \gdef\@thesisdegreeen		{Bachelor of Science}
\fi
\gdef\@thesiscurriculum		{}
\gdef\@thesiscurriculumen	{}
\gdef\@thesisauthor		{\@author}
\gdef\@thesisauthoraddress	{Adresse}
\gdef\@thesismatrikelno		{Matrikelnummer}
\gdef\@thesisadvisor@one	{Thomas Grechenig}
\gdef\@thesisadvisor@two	{}
\gdef\@thesisadvisor@three	{}
\gdef\@thesisauthorpreamble	{Verfasser/In}
\gdef\@thesisadvisorpreamble	{Betreuung}

\gdef\thesistitle#1		{\title				{#1}}
\gdef\thesisshorttitle#1	{\gdef\@shorttitle		{#1}}
\gdef\thesissubtitle#1		{\gdef\@subtitle		{#1}}
\gdef\thesisdate#1		{\date				{#1}}
\gdef\thesistype#1#2		{\gdef\@thesistype		{#1}	\gdef\@thesistypeen	{#2}}
\gdef\thesisdegree#1#2		{\gdef\@thesisdegree		{#1}	\gdef\@thesisdegreeen	{#2}}
\gdef\thesiscurriculum#1#2	{\gdef\@thesiscurriculum	{#1}	\gdef\@thesiscurriculumen{#2}}
\gdef\thesisauthor#1		{\author			{#1}}
\gdef\thesisauthoraddress#1	{\gdef\@thesisauthoraddress	{#1}}
\gdef\thesismatrikelno#1	{\gdef\@thesismatrikelno	{#1}}
\gdef\thesisadvisorone#1	{\gdef\@thesisadvisor@one	{#1}}
\gdef\thesisadvisortwo#1	{\gdef\@thesisadvisor@two	{#1}}
\gdef\thesisadvisorthree#1	{\gdef\@thesisadvisor@three	{#1}}
\gdef\thesisauthorpreamble#1	{\gdef\@thesisauthorpreamble	{#1}}
\gdef\thesisadvisorpreamble#1	{\gdef\@thesisadvisorpreamble	{#1}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% @BEGINDOCUMENT
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\AtBeginDocument{
  \ifthesis@english
    \selectlanguage{english}
  \else
    \selectlanguage{ngerman}
  \fi
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   GLOSSARIES                        %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \ifglossaries
	\makeglossaries
	\InputIfFileExists{abbrev/glossary}{}{}
	\InputIfFileExists{abbrev/acronym}{}{}
  \fi
}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Maketitle
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\renewcommand\maketitle{
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%  TITLEPAGE                          %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \thispagestyle{empty}
  \@maketitle%
  \eject
  \@AfterTitlePages
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%  FRONT MATTERS                      %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \setcounter{tocdepth}{2}
	\pagestyle{plain}
  \FrontMatter
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%  MAIN MATTERS                       %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \mainmatter
  \setcounter{secnumdepth}{2}
  %\setsecnumdepth{subsection}% alternative B
  \aliaspagestyle{chapter}{\chapterheadings}
  \pagestyle{\documentheadings}
}

\def\@maketitle{
  \newlength{\thesisparskip}
  \setlength\thesisparskip{\parskip}
  \setlength\parskip{0pt}
  \wrapTUINFDA%
  \@maketitlepage
  \setlength\parskip{\thesisparskip}
}

\def\@maketitlepage{
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%  DEFAULT TITLEPAGE                  %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \ifthesis@defaulttitlepages
    \ifthesis@masterthesis
      \include{chapters/titlepages/titlepage}
      \ifthesis@doublepage \cleardoublepage \fi
    \fi
    \whichlanguage%
      {\include{chapters/titlepages/titlepage_inso_en}}
      {\include{chapters/titlepages/titlepage_inso}}
    \ifthesis@doublepage \cleardoublepage \fi
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%  TITLEPAGE                          %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \else
    \ifthesis@tutitlepageDE
      \include{chapters/titlepages/titlepage}
      \ifthesis@doublepage \cleardoublepage \fi
    \fi
    \ifthesis@tutitlepageEN
      \include{chapters/titlepages/titlepage_en}
      \ifthesis@doublepage \cleardoublepage \fi
    \fi
    \ifthesis@insotitlepageDE
      \include{chapters/titlepages/titlepage_inso}
      \ifthesis@doublepage \cleardoublepage \fi
    \fi
    \ifthesis@insotitlepageEN
      \include{chapters/titlepages/titlepage_inso_en}
      \ifthesis@doublepage \cleardoublepage \fi
    \fi
  \fi
  \cleardoublepage
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% TUINFDA wrapping
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\gdef\wrapTUINFDA{
  \gdef\tuinfthesistitle{\@thesistitle}
  \gdef\tuinfthesissubtitle{\@thesissubtitle}
  \gdef\tuinfthesisdate{\@thesisdate}
  \gdef\tuinfthesistype{\@thesistype}
  \gdef\tuinfthesistypeen{\@thesistypeen}
  \gdef\tuinfthesisdegree{\@thesisdegree}
  \gdef\tuinfthesisdegreeen{\@thesisdegreeen}
  \gdef\tuinfthesiscurriculum{\@thesiscurriculum}
  \gdef\tuinfthesiscurriculumen{\@thesiscurriculumen}
  \gdef\tuinfthesisverfassung{\@thesisauthorpreamble}
  \gdef\tuinfthesisauthor{\@thesisauthor}
  \gdef\tuinfthesisauthoraddress{\@thesisauthoraddress}
  \gdef\tuinfthesismatrikelno{\@thesismatrikelno}
  \gdef\tuinfthesisbetreuung{\@thesisadvisorpreamble}
  \gdef\tuinfthesisbetreins{\@thesisadvisor@one}
  \gdef\tuinfthesisbetrzwei{\@thesisadvisor@two}
  \gdef\tuinfthesisbetrdrei{\@thesisadvisor@three}
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% FRONT AND BACK MATTERS
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\gdef\FrontMatter{
  \frontmatter
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   TO DO NOTES                       %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@maketodonotes
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   ERKLAERUNG DER SELBSTAENDIGKEIT   %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makedeclaration
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   ACKNOWLEGEMENTS                   %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makeacknowledgements
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   ABSTRACT                          %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makeabstract
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   TABLE OF CONTENTS                 %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \pdfbookmark{\contentsname}{\contentsname}
  \tableofcontents*
  \cleardoublepage
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   Indices                           %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \ifthesis@indextop
	\IndexMatter
  \fi
}

\gdef\BackMatter{
  \cleardoublepage
  %\backmatter
  \@setappendixmarker
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   BIBLIOGRAPHY                      %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makebibliography
  \@resetappendixmarker
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   Indices                           %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \ifthesis@indextop
  \else
	\IndexMatter
  \fi
}

\gdef\IndexMatter{
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   LIST OF FIGURES                   %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makelistoffigures
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   LIST OF TABLES                    %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makelistoftables
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   LIST OF LISTINGS                  %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makelistoflistings
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   LIST OF ALGORITHM                 %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makelistofalgorithm
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%%   ABBREVIATIONS                     %
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  \@makeabbreviations
}

\gdef\AfterTitlePages#1{\gdef\@AfterTitlePages{#1}}
\gdef\@AfterTitlePages{\relax}
\gdef\AfterDeclaration#1{\gdef\@AfterDeclaration{#1}}
\gdef\@AfterDeclaration{\relax}
\gdef\AfterAcknowledgements#1{\gdef\@AfterAcknowledgements{#1}}
\gdef\@AfterAcknowledgements{\relax}
\gdef\AfterAbstract#1{\gdef\@AfterAbstract{#1}}
\gdef\@AfterAbstract{\relax}
\gdef\AfterListOfFigures#1{\gdef\@AfterListOfFigures{#1}}
\gdef\@AfterListOfFigures{\relax}
\gdef\AfterListOfTables#1{\gdef\@AfterListOfTables{#1}}
\gdef\@AfterListOfTables{\relax}
\gdef\AfterListOfListings#1{\gdef\@AfterListOfListings{#1}}
\gdef\@AfterListOfListings{\relax}
\gdef\AfterListOfAlgorithms#1{\gdef\@AfterListOfAlgorithms{#1}}
\gdef\@AfterListOfAlgorithms{\relax}
\gdef\AfterAbbreviations#1{\gdef\@AfterAbbreviations{#1}}
\gdef\@AfterAbbreviations{\relax}
\gdef\AfterOnlineBibliography#1{\gdef\@AfterOnlineBibliography{#1}}
\gdef\@AfterOnlineBibliography{\relax}
\gdef\AfterBibliography#1{\gdef\@AfterBibliography{#1}}
\gdef\@AfterBibliography{\relax}

\def\@maketodonotes{
  \ifthesis@todonotes
    \listoftodos
    \thispagestyle{plain}
    \cleardoublepage
  \fi
}
\def\@makedeclaration{
  \ifthesis@declaration
    \input{chapters/abstract/declaration}
    \cleardoublepage
    \@AfterDeclaration
    \cleardoublepage
  \fi
}
\def\@makeacknowledgements{
  \ifthesis@acknowledgements
    \input{chapters/abstract/acknowledgements}
    \cleardoublepage
    \@AfterAcknowledgements
    \cleardoublepage
  \fi
}
\def\@makeabstract{
  \input{chapters/abstract/abstract}
  \cleardoublepage
  \@AfterAbstract
  \cleardoublepage
}
\def\@makelistoffigures{
  \ifthesis@listoffigures
	\ifthesis@toc
	    \listoffigures
	\else
		\listoffigures*
	\fi
	\cleardoublepage
    \@AfterListOfFigures
	\cleardoublepage
  \fi
}
\def\@makelistoftables{
  \ifthesis@listoftables
	\ifthesis@toc
	    \listoftables
	\else
		\listoftables*
	\fi
	\cleardoublepage
    \@AfterListOfTables
	\cleardoublepage
  \fi
}
\def\@makelistoflistings{
  \ifthesis@listoflistings
	\cleardoublepage
	\phantomsection
	\ifthesis@toc
		\addcontentsline{toc}{chapter}{\listingslabel}
	\fi
    \lstlistoflistings
    \@AfterListOfListings
	\cleardoublepage
  \fi
}
\def\@makelistofalgorithm{
  \ifthesis@listofalgorithms
	\cleardoublepage
	\phantomsection
	\ifthesis@toc
		\addcontentsline{toc}{chapter}{\algorithmslabel}
	\fi
    \listofalgorithms
	\cleardoublepage
    \@AfterListOfAlgorithms
	\cleardoublepage
  \fi
}
\def\@makeabbreviations{
  \ifthesis@listofabbrev
	\ifglossary
		\printglossary
		\cleardoublepage
	\fi
	\ifacronym
		\printglossary[type=\acronymtype, title=\abbreviationslabel,toctitle=\abbreviationslabel]
		\cleardoublepage
	\fi
    \@AfterAbbreviations
	\cleardoublepage
  \fi
}
\def\@makebibliography{
  \ifthesis@webreferences
	\printbibheading
    \printbibliography[nottype=online,title={\bibliographylabel},heading=subbibliography]
	%\cleardoublepage
    \@AfterBibliography
%	\cleardoublepage
    \printbibliography[type=online,title={\onlinebibliographylabel},heading=subbibliography]
	%\cleardoublepage
    \@AfterOnlineBibliography
	\cleardoublepage
  \else
    \printbibliography
	\cleardoublepage
    \@AfterOnlineBibliography
    \@AfterBibliography
	\cleardoublepage
  \fi
}

\def\@setappendixmarker{
  \let\oldrightmark\rightmark
  \xdef\rightmark{}
  %\xdef\leftmark{Appendix}
}
\def\@resetappendixmarker{
  \let\rightmark\oldrightmark
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% STYLE
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\setlength\parindent{0px}
%\setfont{sectioning}{\sffamily\mdseries}
\chapterstyle{section}
\renewcommand{\chapterheadstart}{\vspace*{0pt}}
\urlstyle{same}

% Font
\renewcommand*{\chapnamefont}{\huge\sffamily}
\renewcommand*{\chaptitlefont}{\Huge\sffamily}
\renewcommand*{\chapnumfont}{\Huge\sffamily}
\setsecheadstyle{\Large\sffamily\mdseries}
\setsubsecheadstyle{\large\sffamily\mdseries}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% LOGO
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% DEFAULT SETTINGS
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\g@addto@macro\insertchapterspace{\addtocontents{lol}{\protect\addvspace{10pt}}}

\setlength{\skip\footins}{1.8\baselineskip}
\setlength\footnotemargin{1em}
\setlength\parskip{0.4\baselineskip}
\graphicspath{{figures/titlepage/}{figures/}}
%\geometry{a4paper, top=2.5cm, bottom=2.5cm}
%\geometry{a4paper}
\geometry{a4paper, bottom=2.5cm, top=3cm, left=3.5cm, right=2.5cm}

% settings of hyperlinks
\hypersetup{
  linkcolor=black,
  urlcolor=black,
  citecolor=black,
  breaklinks=true,
  colorlinks=true,
  frenchlinks=true,
  bookmarks=true
}

% listing settings
\lstset{
  basicstyle={\small\singlespacing},
  tabsize=2,
  numbers=left,
  numberstyle={\scriptsize\bfseries},
  numbersep=5pt,
  %frame=lines,
  breakatwhitespace=false,
  breaklines=true,
  prebreak={},
  postbreak={\mbox{\ensuremath{\hookrightarrow}}\space},
  breakindent=0pt,
  captionpos=b,
  xleftmargin=16pt,
  fontadjust,
}

% Verhinderung von "Schusterjungen"
% einzelne Absatzzeilen auf der Seite unten
\clubpenalty = 10000

% Verhinderung von "Hurenkindern"
% einzelne Zeilen eines Absatzes am Kopf der Seite
\widowpenalty = 10000

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Headers
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\fancyhf	{} 			% alle Felder loeschen
\renewcommand	{\headrulewidth}{0.4pt} % unterdruecken der Linie
\renewcommand	{\footrulewidth}{0.4pt} % unterdruecken der Linie
% \setlength	\headsep{2cm}		% header skip
\fancyhead [L]	{\nouppercase{\leftmark}}
\fancyhead [R]	{\nouppercase{\rightmark}}
\fancyfoot [L]	{\parbox[b]{0.75\linewidth}{\@shorttitle}}
\fancyfoot [R]	{\pagelabel}

\makepagestyle{insochapter}
\makeevenhead{insochapter}{}{}{}
\makeoddhead{insochapter}{}{}{}
\makeevenfoot{insochapter}{}{}{\rule{\textwidth}{\footrulewidth}\\\pagelabel}
\makeoddfoot{insochapter}{}{}{\rule{\textwidth}{\footrulewidth}\\\pagelabel}

\newcommand{\chapterheadings}{fancy}
\newcommand{\documentheadings}{fancy}

\makeevenhead{plain}{}{}{}
\makeoddhead{plain}{}{}{}
\makeoddfoot{plain}{}{\thepage}{}
\makeevenfoot{plain}{}{\thepage}{}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Language specific
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\def\whichlanguage#1#2{% depending of the language the first english text or the second german text will be used
  \relax\iflanguage{english}{#1}{\iflanguage{ngerman}{#2}{\iflanguage{german}{#2}{#1}}}\relax
}

%\def\pagelabel{\whichlanguage{Page~\thepage~of~\pageref{LastPage}}{Seite~\thepage~von~\pageref{LastPage}}}
\def\pagelabel{\thepage\,/\,\pageref*{LastPage}}

\renewcommand{\lstlistlistingname}{\listingslabel}
\renewcommand{\lstlistingname}{\listingcaptionlabel}
\renewcommand{\listalgorithmcfname}{\algorithmslabel}
\renewcommand{\algorithmcfname}{\algorithmcaptionlabel}

\def\bibliographylabel{\whichlanguage{References}{Wissenschaftliche Literatur}}
\def\onlinebibliographylabel{\whichlanguage{Online References}{Online Referenzen}}
\def\declarationlabel{\whichlanguage{Statement by Author}{Eidesstattliche Erkl\"arung}}
\def\acknowledgementslabel{\whichlanguage{Acknowledgements}{Danksagung}}
\def\abstractlabel{\whichlanguage{Abstract}{Kurzfassung}}
\def\abbreviationslabel{\whichlanguage{List of Abbreviations}{Abk\"urzungen}}
\def\algorithmcaptionlabel{\whichlanguage{Algorithm}{Algorithmus}}
\def\algorithmslabel{\whichlanguage{List of Algorithms}{Liste der Algorithmen}}
\def\listingslabel{\whichlanguage{List of Listings}{Liste der Listings}}
\def\listingcaptionlabel{\whichlanguage{Listing}{Listing}}
\def\appendixlabel{\whichlanguage{Appendix}{Anhang}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% RENEW COMMANDS
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% \let\babel@selectlanguage\selectlanguage
% \renewcommand{\selectlanguage}[1]{\todo[inline]{#1}\babel@selectlanguage{#1}}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% Useful commands
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% EOF
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\makeatother
\endinput
