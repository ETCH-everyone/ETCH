package com.ssafy.etch.portfolio.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.portfolio.dto.PortfolioDetailResponseDTO;
import com.ssafy.etch.portfolio.dto.PortfolioListResponseDTO;
import com.ssafy.etch.portfolio.dto.PortfolioRequestDTO;
import com.ssafy.etch.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;


    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<PortfolioListResponseDTO>>> getPortfolioList(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        List<PortfolioListResponseDTO> list = portfolioService.getPortfolioList(oAuth2User.getId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PortfolioListResponseDTO>> createPortfolio(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User,
            @RequestBody PortfolioRequestDTO portfolioRequestDTO) {

        portfolioService.savePortfolio(oAuth2User.getId(), portfolioRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "포트폴리오 등록 성공"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updatePortfolio(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User,
            @RequestBody PortfolioRequestDTO portfolioRequestDTO,
            @PathVariable Long id) {

        portfolioService.updatePortfolio(oAuth2User.getId(), id, portfolioRequestDTO);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "포트폴리오 수정 성공"));
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<?>> deletePortfolio(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User,
            @PathVariable Long portfolioId) {

        portfolioService.deletePortfolio(oAuth2User.getId(), portfolioId);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null, "포트폴리오 삭제 완료"));
    }

    @GetMapping("/{portfolioId}")
    public ResponseEntity<ApiResponse<PortfolioDetailResponseDTO>> getPortfolioInfo(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User,
            @PathVariable Long portfolioId) {

        PortfolioDetailResponseDTO portfolioDetailResponseDTO = portfolioService.getPortfolioDetail(oAuth2User.getId(), portfolioId);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(portfolioDetailResponseDTO, "포트폴리오 상세조회"));
    }
}
