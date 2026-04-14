import json
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

class BaseAgent:
    """Base class for all AI agents in the stock research pipeline."""
    
    def __init__(self, model_name="gemini-pro"):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set in Django settings.")
        
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=api_key,
            temperature=0.2 # Lower temperature for analytical tasks
        )

    def run(self, ticker, market_data):
        """Must be implemented by subclasses."""
        raise NotImplementedError("Subclasses must implement run()")

class FundamentalAgent(BaseAgent):
    def run(self, ticker_symbol, market_data):
        info = market_data.get('info', {})
        prompt = ChatPromptTemplate.from_template("""
            You are a Senior Fundamental Analyst. Analyze the following financial data for {ticker}.
            Data: {data}
            
            Focus on:
            1. Revenue and Profitability (Margins, P/E ratio)
            2. Efficiency (ROE, ROA)
            3. Balance Sheet Health (Debt/Equity, Current Ratio)
            
            Return your analysis as a structured JSON object with keys: 
            "summary" (string), "strengths" (list), "weaknesses" (list), "verdict" (string).
        """)
        
        chain = prompt | self.llm
        # Using simple string parsing or StructuredOutputParser is better, 
        # but for speed we'll ask for JSON and parse.
        response = chain.invoke({
            "ticker": ticker_symbol,
            "data": json.dumps(info, default=str)
        })
        
        return self._parse_json(response.content)

    def _parse_json(self, content):
        # Basic cleanup of markdown blocks if any
        clean_content = content.strip().replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(clean_content)
        except:
            return {"error": "Failed to parse AI response", "raw": content}

class SentimentAgent(BaseAgent):
    def run(self, ticker_symbol, market_data):
        news = market_data.get('news', [])
        headlines = [n.get('title') for n in news[:10]]
        
        prompt = ChatPromptTemplate.from_template("""
            You are a Market Sentiment Specialist. Analyze these headlines for {ticker}:
            Headlines: {headlines}
            
            Determine:
            1. Overall sentiment score (-1.0 to 1.0)
            2. Major themes or concerns in the news
            3. Buzz level (high/medium/low)
            
            Return JSON with keys: "sentiment_score" (float), "mood" (string), "themes" (list), "summary" (string).
        """)
        
        chain = prompt | self.llm
        response = chain.invoke({
            "ticker": ticker_symbol,
            "headlines": headlines
        })
        return self._parse_json(response.content)

    def _parse_json(self, content):
        clean_content = content.strip().replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(clean_content)
        except:
            return {"error": "Failed to parse AI response", "raw": content}

class RiskAgent(BaseAgent):
    def run(self, ticker_symbol, market_data):
        info = market_data.get('info', {})
        history = market_data.get('history', {}) # History is a DataFrame
        
        prompt = ChatPromptTemplate.from_template("""
            You are a Risk Management Consultant. Evaluate potential investment risks for {ticker}.
            Fundamental Data: {data}
            
            Identify:
            1. Operational risks
            2. Financial risks (Debt, liquidity)
            3. Market risks (Volatility, competition)
            
            Return JSON with keys: "risk_level" (string: Low/Medium/High/Extreme), "warnings" (list), "risk_summary" (string).
        """)
        
        chain = prompt | self.llm
        response = chain.invoke({
            "ticker": ticker_symbol,
            "data": json.dumps(info, default=str)
        })
        return self._parse_json(response.content)

    def _parse_json(self, content):
        clean_content = content.strip().replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(clean_content)
        except:
            return {"error": "Failed to parse AI response", "raw": content}

class ValuationAgent(BaseAgent):
    def run(self, ticker_symbol, market_data):
        info = market_data.get('info', {})
        
        prompt = ChatPromptTemplate.from_template("""
            You are a Valuation Expert. Estimate if {ticker} is fairly valued.
            Current Price: {price}
            P/E Ratio: {pe}
            52 Week High: {high52}
            52 Week Low: {low52}
            
            Provide:
            1. Comparison to historical range
            2. Opinion on valuation (Undervalued, Fairly Valued, Overvalued)
            3. Target price range (optional)
            
            Return JSON with keys: "valuation_status" (string), "fair_price_estimate" (string), "reasoning" (string).
        """)
        
        chain = prompt | self.llm
        response = chain.invoke({
            "ticker": ticker_symbol,
            "price": info.get('currentPrice'),
            "pe": info.get('trailingPE'),
            "high52": info.get('fiftyTwoWeekHigh'),
            "low52": info.get('fiftyTwoWeekLow')
        })
        return self._parse_json(response.content)

    def _parse_json(self, content):
        clean_content = content.strip().replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(clean_content)
        except:
            return {"error": "Failed to parse AI response", "raw": content}
